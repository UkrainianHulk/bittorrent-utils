import config from '../libs/config.js'
import { getBalance, transfer } from '../services/ledger/index.js'
import { numberToPercent } from '../libs/utils.js'
import { PrivateKey } from '../libs/keys.js'

const {
    DEV_FEE_PERCENT
} = config

const devFeePercent = numberToPercent(DEV_FEE_PERCENT)
const devPublicKeyStr =
    'BHGaoDov6gsuHbfk2Tc0cAyHABw3hoKS2Cv1uBpA+/nVc1JikV6IxqEZ/5NlizPGFpvMtONMyBeJcXOIb4Jdnjk='

export default async function ({
    payerPrivateKeyStr,
    recipientPublicKeyStr,
    amount
}) {
    const privateKey = new PrivateKey(payerPrivateKeyStr)
    const payerBalance = await getBalance(privateKey.public.string)

    const processTransfer = async (paymentAmount, devFeeAmount) => {
        const transactions = []
        
        paymentAmount && transactions.push(transfer({
            payerPrivateKeyStr,
            recipientPublicKeyStr,
            amount: paymentAmount,
        }))

        devFeeAmount && transactions.push(transfer({
            payerPrivateKeyStr,
            recipientPublicKeyStr: devPublicKeyStr,
            amount: devFeeAmount,
        }))

        const result = await Promise.all(transactions)

        return {
            paymentAmount,
            result,
        }
    }

    if (payerBalance <= 0) throw new Error('Empty balance')

    if (typeof amount === 'string' && amount === 'all') {
        const devFeeAmount = Math.round(payerBalance * devFeePercent)
        const paymentAmount = payerBalance - devFeeAmount
        return await processTransfer(paymentAmount, devFeeAmount)
    } 
    
    if (typeof amount === 'number') {
        const devFeeAmount = Math.round(amount * devFeePercent)
        const paymentAmount = amount
        const requestedAmount = paymentAmount + devFeeAmount
        
        if (payerBalance < requestedAmount) throw new Error(`Not enough balance`)
        
        return await processTransfer(paymentAmount, devFeeAmount)
    } else throw new Error(`Wrong amount specified`)
}