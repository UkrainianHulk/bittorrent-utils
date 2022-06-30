const config = require('config')
const fetch = require('node-fetch')
const { networkInterfaces } = require('os')
// eslint-disable-next-line no-unused-vars
const colors = require('colors')
const { InfluxDB, Point } = require('@influxdata/influxdb-client')
const inAppTransfer = require('./libs/inAppTransfer.js')
const ledgerRPC = require('./libs/ledgerRPC.js')
const client = require('./client.js')
const { UBTTtoBTT, iteration } = require('./libs/utils.js')
const log = require('./libs/log.js')

const intervalSeconds = config.get('AUTOTRANSFER_INTERVAL_SECONDS')
const payersKeys = config.get('AUTOTRANSFER_FROM')
const recipientKey = config.get('AUTOTRANSFER_TO')
const historyAgeHours = config.get('AUTOTRANSFER_HISTORY_AGE_HOURS')
const influxDbEnabled = config.get('AUTOTRANSFER_INFLUXDB_ENABLED')
const influxDbUrl = config.get('AUTOTRANSFER_INFLUXDB_URL')
const influxDbToken = config.get('AUTOTRANSFER_INFLUXDB_TOKEN')
const influxDbOrg = config.get('AUTOTRANSFER_INFLUXDB_ORG')
const influxDbBucket = config.get('AUTOTRANSFER_INFLUXDB_BUCKET')

const getBttPrice = async () => {
    const response = await fetch(
        'https://api.binance.com/api/v3/ticker/price?symbol=BTTCUSDT'
    )
    const json = await response.json()
    const value = parseFloat(json.price) * 1000
    return value
}

const getPayers = async () => {
    try {
        if (payersKeys === 'auto') {
            const payer = await client.bitTorrentSpeed.getPrivateKey()
            log.info(`Local client private key: ${payer}`)
            return [payer]
        } else if (typeof payersKeys === 'string') {
            return [payersKeys]
        } else if (Array.isArray(payersKeys)) {
            return payersKeys
        } else throw new Error('"AUTOTRANSFER_FROM" setting must be a string or an array')
    } catch (error) {
        log.error(error)
        return []
    }
}

const Hisotry = class {
    constructor(historyAgeHours) {
        this.transactions = []
        this.historyAgeMS = historyAgeHours * 60 * 60 * 1000
    }

    push(transaction) {
        this.transactions.push(transaction)
        for (let i = this.transactions.length - 1; i >= 0; i--) {
            const transactionAgeMS = Date.now() - this.transactions[i].timestamp
            if (transactionAgeMS > this.historyAgeMS)
                this.transactions.splice(i, 1)
        }
    }

    getGlobalProfitability = () =>
        this.transactions.reduce(
            (acc, transaction) => acc + transaction.paymentAmount,
            0
        )

    getPayerProfitability = (payerIndex) =>
        this.transactions.reduce(
            (acc, transaction) =>
                transaction.payerIndex === payerIndex
                    ? acc + transaction.paymentAmount
                    : acc,
            0
        )
}

const history = new Hisotry(historyAgeHours)

const autoTransfer = async (payerPrivateKey, payerIndex, payers) => {
    try {
        const transferResult = await inAppTransfer({
            payerIndex,
            payerPrivateKey,
            recipientKey,
            amount: 'all',
        })

        history.push({
            payerIndex,
            paymentAmount: transferResult.paymentAmount,
            timestamp: Date.now(),
        })

        if (influxDbEnabled) {
            const ip = Object.values(networkInterfaces()).flat().find((i) => i?.family === 'IPv4' && !i?.internal)?.address;
            const client = new InfluxDB({ url: influxDbUrl, token: influxDbToken })
            const writeApi = client.getWriteApi(influxDbOrg, influxDbBucket)
            const point = new Point(ip).floatField('income', UBTTtoBTT(transferResult.paymentAmount))
            
            writeApi.writePoint(point)

            await writeApi.close()

            log.debug('Transfer amount sent to influxDB')
        }

        const recipientBalance = (
            await ledgerRPC.createAccount({
                key: recipientKey,
            })
        ).account.balance

        const bttPrice = await getBttPrice()

        const paymentAmountStr = UBTTtoBTT(
            transferResult.paymentAmount
        ).toLocaleString()
        const recipientBalanceStr = UBTTtoBTT(recipientBalance).toLocaleString()
        const recipientBalancePriceStr = (
            UBTTtoBTT(recipientBalance) * bttPrice
        ).toLocaleString()
        const transferLogStr = `Payer #${payerIndex}: ${
            paymentAmountStr.brightMagenta
        } -> ${(recipientBalanceStr + ' BTT').brightMagenta} (${
            (recipientBalancePriceStr + ' USDT').brightGreen
        })`

        if (!historyAgeHours) log.info(transferLogStr)
        else if (historyAgeHours) {
            const payerProfit = UBTTtoBTT(
                history.getPayerProfitability(payerIndex)
            )
            const globalProfit = UBTTtoBTT(history.getGlobalProfitability())
            const payerProfitPercent =
                Math.round((payerProfit / globalProfit) * 10000) / 100

            const payerProfitStr = payerProfit.toLocaleString()
            const payerProfitPriceStr = (
                payerProfit * bttPrice
            ).toLocaleString()
            const globalProfitStr = globalProfit.toLocaleString()
            const globalProfitPriceStr = (
                globalProfit * bttPrice
            ).toLocaleString()

            const payerProfitLogStr = `, last ${historyAgeHours} hour(s) profit: ${
                (payerProfitStr + ' BTT').brightMagenta
            } (${(payerProfitPriceStr + ' USDT').brightGreen})`
            if (payers.length === 1) {
                log.info(transferLogStr + payerProfitLogStr)
            } else {
                log.info(
                    transferLogStr +
                        payerProfitLogStr +
                        ` - ${payerProfitPercent}% of global ${
                            (globalProfitStr + ' BTT').brightMagenta
                        } (${(globalProfitPriceStr + ' USDT').brightGreen})`
                )
            }
        }

        return
    } catch (error) {
        if (error.message === 'empty balance')
            log.debug(`Payer #${payerIndex}: ${error.message}`)
        else log.error(error)
    }
}

const autoTransferIteration = (...args) =>
    iteration(
        autoTransfer,
        intervalSeconds * 1000,
        ...args
    )

module.exports.start = async () => {
    const payers = await getPayers()
    await Promise.all(payers.map(autoTransferIteration))
}
