import 'colors'
import { setTimeout } from 'timers/promises'
import fetch from 'node-fetch'
import log from '../libs/log.js'
import config from '../libs/config.js'
import bitTorrentSpeed from '../services/bitTorrentSpeedAccess.js'
import inAppTransfer from './inAppTransfer.js'

const {     
    AUTOTRANSFER_TO,
    AUTOTRANSFER_FROM,
    AUTOTRANSFER_INTERVAL_SECONDS,
    // AUTOTRANSFER_HISTORY_AGE_HOURS,
    // AUTOTRANSFER_INFLUXDB_ENABLED,
    // AUTOTRANSFER_INFLUXDB_URL,
    // AUTOTRANSFER_INFLUXDB_TOKEN,
    // AUTOTRANSFER_INFLUXDB_ORGANISATION,
    // AUTOTRANSFER_INFLUXDB_BUCKET
} = config

const getBttPrice = async () => {
    const response = await fetch(
        'https://api.binance.com/api/v3/ticker/price?symbol=BTTCUSDT'
    )
    const json = await response.json()
    const value = parseFloat(json.price)
    return value
}

async function getPayerPrivateKey() {
    if (AUTOTRANSFER_FROM === 'local')
        return await bitTorrentSpeed.getPrivateKey()
    return AUTOTRANSFER_FROM
}

async function autoTransfer() {
    const payerPrivateKeyStr = await getPayerPrivateKey()
    const [
        price,
        { paymentAmount, newBalance }
    ] = await Promise.all([
        getBttPrice(),
        inAppTransfer({
            payerPrivateKeyStr,
            recipientPublicKeyStr: AUTOTRANSFER_TO,
            amount: 'all'
        })
    ])
    const equivalent = price * newBalance
    const equivalentStr = (equivalent.toFixed(2).toLocaleString() + ' USDT').brightGreen
    const paymentAmountStr = (paymentAmount.toLocaleString() + ' BTT').brightMagenta
    const newBalanceStr = (newBalance.toLocaleString() + ' BTT').brightMagenta

    log.info(`${paymentAmountStr} -> ${newBalanceStr} (${equivalentStr})`)
}

export async function start() {
    try {
        await autoTransfer()
    } catch (error) {
        if (error.message === 'Empty balance') 
            return log.debug('No balance to transfer')
            
        log.error(`Autotransfer: ${error.message}`)
        log.debug(error)
    } finally {
        await setTimeout(AUTOTRANSFER_INTERVAL_SECONDS * 1000)
        await start()
    }
}