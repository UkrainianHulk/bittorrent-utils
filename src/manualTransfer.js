const process = require('process')
const readline = require('readline')
const colors = require('colors')
const config = require('config')
const ledgerRPC = require('./libs/ledgerRPC.js')
const {numberToPercent, UBTTtoBTT} = require('./libs/utils.js')
const log = require('./libs/log.js')
const inAppTransfer = require('./libs/inAppTransfer.js')
const {PrivateKey, processKey} = require('./libs/keys.js')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
})

const devFeePercent = numberToPercent(config.get('DEV_FEE_PERCENT'))

const question = (msg) => new Promise(resolve => rl.question(msg, resolve))

const askPayer = async () => {
    const payer = await question(`Enter payer's SPEED or BTFS private key:\n`)
    try {
        return new PrivateKey(payer)
    } catch (error) {
        console.error(error.message.brightRed)
        return await askPayer()
    }
}

const askRecipient = async () => {
    const recipient = await question(`Enter recipient's SPEED public key / SPEED private key / BTFS private key:\n`)
    try {
        return processKey(recipient)
    } catch (error) {
        console.error(error.message.brightRed)
        return await askRecipient()
    }
}

const askAmount = async (balance) => {
    const amount = await question(`Enter BTT amount:\n`)
    if (/^\d+([,\.]\d{1,6})?$/.test(amount)) {
        const amountInt = parseFloat(amount.replace(',', '.')) * 1000000
        if (amountInt === 0) {
            console.error(`Amount cant be zero`.brightRed)
            return await askAmount(balance)
        }
        else if ((devFeePercent * amountInt + amountInt) <= balance) return amountInt
        else {
            console.error(`Not anough balance ${devFeePercent ? 'considering the commission' : ''}`.brightRed)
            return await askAmount(balance)
        }
    } else {
        console.error('Enter correct amount'.brightRed)
        return await askAmount(balance)
    }
}

const askConfirmation = async () => {
    const confirmation = await question(`Type "YES" to confirm the transaction:\n`)
    if (confirmation === 'YES') return true
    else {
        console.error(`Wrong confirmation. Please type "YES" or close the app`.brightRed)
        return askConfirmation()
    }
}

async function run() {
    console.log(`You have launched the BTT in-app transfer utility.`)
    console.log(`Follow the program prompts and ` + `remember to check input data twice!`.cyan)
    const payer = await askPayer()
    rl.pause()
    const payerBalance = (await ledgerRPC.createAccount({
        key: payer.public.uncompressed.toString('base64')
    })).account.balance
    console.log(`Payer's balance: ` + `${(UBTTtoBTT(payerBalance)).toLocaleString()}`.brightMagenta)
    rl.resume()
    const recipient = await askRecipient()
    const amount = await askAmount(payerBalance)
    const devFeeAmount = Math.round(devFeePercent * amount)

    console.log(`
        Payer: ${payer.source}
        Recipient: ${recipient.source}
        Amount: ${UBTTtoBTT(amount).toLocaleString()}
        DevFee: ${UBTTtoBTT(devFeeAmount).toLocaleString()} (${config.get('DEV_FEE_PERCENT').toFixed(2)}%)
        Total: ${UBTTtoBTT(amount + devFeeAmount).toLocaleString()}
    `.cyan)
    
    const confirmation = await askConfirmation()

    if (confirmation) {
        const result = await inAppTransfer({
            payerPrivateKey: payer.source,
            recipientKey: recipient.source,
            amount: amount
        })
        if (result) console.log('Success! '.green + `Payer's new balance: ` + `${UBTTtoBTT(result.payerNewBalance).toLocaleString()}`.brightMagenta)
    }

    rl.close()
}

run()