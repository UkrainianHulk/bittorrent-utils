import 'colors'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'

import config from '../libs/config.js'
import inAppTransfer from './inAppTransfer.js'
import { numberToPercent } from '../libs/utils.js'
import { PublicKey, PrivateKey } from '../libs/keys.js'
import { getBalance } from '../services/ledger/index.js'

const rl = createInterface({
  input: stdin,
  output: stdout,
  terminal: false
})

const { DEV_FEE_PERCENT } = config
const devFeePercent = numberToPercent(DEV_FEE_PERCENT)

const askPayer = async () => {
  const privateKey = await rl.question(`Enter payer's SPEED private key:\n`)
  try {
    return new PrivateKey(privateKey)
  } catch (error) {
    console.error(error.message.brightRed)
    return await askPayer()
  }
}

const askRecipient = async () => {
  const publicKey = await rl.question(`Enter recipient's SPEED public key:\n`)
  try {
    return new PublicKey(publicKey)
  } catch (error) {
    console.error(error.message.brightRed)
    return await askRecipient()
  }
}

const askAmount = async (balance) => {
  const amount = await rl.question(`Enter BTT amount:\n`)
  const isAmountCorrect = /^\d+([,.]\d{1,6})?$/.test(amount)

  if (isAmountCorrect === false) {
    console.error('Enter correct amount'.brightRed)
    return await askAmount(balance)
  }

  const amountInt = parseFloat(amount.replace(',', '.'))

  if (amountInt === 0) {
    console.error(`Amount cant be zero`.brightRed)
    return await askAmount(balance)
  }

  if (balance < devFeePercent * amountInt + amountInt) {
    console.error(`Not anough balance ${devFeePercent ? 'considering the commission' : ''}`.brightRed)
    return await askAmount(balance)
  }

  return amountInt
}

const askConfirmation = async () => {
  const confirmation = await rl.question(`Type "YES" to confirm the transaction:\n`)

  if (confirmation !== 'YES') {
    console.error(`Wrong confirmation. Please type "YES" or close the app`.brightRed)
    return askConfirmation()
  }

  return true
}

async function run() {
  console.log(`You have launched the BTT in-app transfer utility.`)
  console.log(`Follow the program prompts and ` + `remember to check input data twice!`.cyan)
  const payer = await askPayer()
  rl.pause()
  const payerBalance = await getBalance(payer.public.string)
  console.log(`Payer's balance: ` + payerBalance.toLocaleString().brightMagenta)
  rl.resume()
  const recipient = await askRecipient()
  const amount = await askAmount(payerBalance)
  const devFeeAmount = devFeePercent * amount

  console.log(
    `
        Payer: ${payer.string}
        Recipient: ${recipient.string}
        Amount: ${amount.toLocaleString()}
        DevFee: ${devFeeAmount} (${DEV_FEE_PERCENT.toFixed(2)}%)
        Total: ${(amount + devFeeAmount).toLocaleString()}
    `.cyan
  )

  const confirmation = await askConfirmation()

  if (confirmation) {
    const paidAmount = await inAppTransfer({
      payerPrivateKeyStr: payer.string,
      recipientPublicKeyStr: recipient.string,
      amount
    })
    console.log('Success! '.green + 'Paid amount: ' + paidAmount.toLocaleString().brightMagenta)
  }

  rl.close()
}

run()
