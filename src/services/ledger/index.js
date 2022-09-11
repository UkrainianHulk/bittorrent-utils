import { loadPackageDefinition, credentials } from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import protobuf from 'protobufjs'
import { PrivateKey, PublicKey } from '../../libs/keys.js'
import { UBTTtoBTT } from '../../libs/utils.js'

const grpcAdress = 'ledger.bt.co:443'
const ledgerProtoPath = './src/services/Ledger/protos/ledger.proto'
const ledgerProto = (await protobuf.load(ledgerProtoPath)).nested.ledger
const packageDefinition = protoLoader.loadSync(ledgerProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})
const PackageObject = loadPackageDefinition(packageDefinition).ledger
const ledgerClient = new PackageObject.Channels(
    grpcAdress,
    credentials.createSsl()
)

export const getBalance = (publicKeyStr) =>
    new Promise((resolve, reject) => {
        const publicKey = new PublicKey(publicKeyStr)
        const request = { key: publicKey.bufferUncompressed }

        ledgerClient.CreateAccount(request, function (error, response) {
            if (error) return reject(error)
            const balanceUbttStr = response.account.balance
            const balanceUbttInt = parseInt(balanceUbttStr)
            const balanceBttInt = UBTTtoBTT(balanceUbttInt)
            resolve(balanceBttInt)
        })
    })

export const transfer = ({ payerPrivateKeyStr, recipientPublicKeyStr, amount }) =>
    new Promise((resolve, reject) => {
        const payerPrivateKeyObject = new PrivateKey(payerPrivateKeyStr)
        const recipientPublicKeyObject = new PublicKey(recipientPublicKeyStr)

        const transferRequest = {
            payer: { key: payerPrivateKeyObject.public.uncompressed },
            recipient: { key: recipientPublicKeyObject.uncompressed },
            amount,
        }

        const TransferRequestMessageType = ledgerProto
            .lookupType('ledger.TransferRequest')
        const TransferRequestMessage = TransferRequestMessageType
            .create(transferRequest)
        const serializedTransferRequestMessage = TransferRequestMessageType
            .encode(TransferRequestMessage)
            .finish()
        const signature = payerPrivateKeyObject
            .hashAndSign(serializedTransferRequestMessage)

        const request = {
            transfer_request: transferRequest,
            signature,
        }

        ledgerClient.Transfer(request, function (error, response) {
            if (error) reject(error)
            else resolve(response)
        })
    })