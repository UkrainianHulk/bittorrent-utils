import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import type { ProtoGrpcType as LedgerGrpcType } from './protos-types/ledger/ledger.js';
import protoLoader from '@grpc/proto-loader';
import protobuf from 'protobufjs';
import { PrivateKey, PublicKey } from '../../libs/keys.js';
import { UBTTtoBTTC, BTTCtoUBTT } from '../../libs/utils.js';

const grpcAdress = 'ledger.bt.co:443';
const ledgerProtoPath = './src/services/Ledger/protos/ledger.proto';
const packageDefinition = await protoLoader.load(ledgerProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const packageObject = loadPackageDefinition(
  packageDefinition
) as unknown as LedgerGrpcType;
const ledgerClient = new packageObject.ledger.Channels(
  grpcAdress,
  credentials.createSsl()
);

const ledgerProtoRoot = await protobuf.load(ledgerProtoPath);

export const getBalance = async (publicKeyStr: string): Promise<number> => {
  return await new Promise((resolve, reject) => {
    const publicKey = new PublicKey(publicKeyStr);
    const request = { key: publicKey.uncompressedBuffer };

    ledgerClient.CreateAccount(request, function (error, response) {
      if (error != null) reject(error);
      else {
        if (response?.account == null)
          throw new Error('Failed to get ledger account output');
        const balanceUbttStr = response.account.balance;
        const balanceUbttInt = parseInt(balanceUbttStr);
        const balanceBttInt = UBTTtoBTTC(balanceUbttInt);
        resolve(balanceBttInt);
      }
    });
  });
};

export const transfer = async ({
  payerPrivateKeyStr,
  recipientPublicKeyStr,
  amount,
}: {
  payerPrivateKeyStr: string;
  recipientPublicKeyStr: string;
  amount: number;
}): Promise<number> => {
  return await new Promise((resolve, reject) => {
    const payerPrivateKeyObject = new PrivateKey(payerPrivateKeyStr);
    const recipientPublicKeyObject = new PublicKey(recipientPublicKeyStr);

    const transferRequest = {
      payer: { key: payerPrivateKeyObject.public.uncompressedBuffer },
      recipient: { key: recipientPublicKeyObject.uncompressedBuffer },
      amount: BTTCtoUBTT(amount),
    };
    const TransferRequestMessageType = ledgerProtoRoot.lookupType(
      'ledger.TransferRequest'
    );
    const TransferRequestMessage =
      TransferRequestMessageType.create(transferRequest);
    const serializedTransferRequestMessage = TransferRequestMessageType.encode(
      TransferRequestMessage
    ).finish();
    const signature = payerPrivateKeyObject.hashAndSign(
      serializedTransferRequestMessage
    );

    const request = {
      transfer_request: transferRequest,
      signature,
    };

    ledgerClient.Transfer(request, function (error, response) {
      if (error != null) reject(error);
      else {
        if (response?.balance == null)
          throw new Error('Failed to get ledger transfer output');
        const UBTT = parseInt(response.balance);
        resolve(UBTTtoBTTC(UBTT));
      }
    });
  });
};