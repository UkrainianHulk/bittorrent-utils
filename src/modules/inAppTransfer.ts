import config from '../libs/config.js';
import { getBalance, transfer } from '../services/ledger/index.js';
import { numberToPercent } from '../libs/utils.js';
import { PrivateKey } from '../libs/keys.js';

const { DEV_FEE_PERCENT } = config;

const devFeePercent = numberToPercent(DEV_FEE_PERCENT);
const devPublicKeyStr =
  'BHGaoDov6gsuHbfk2Tc0cAyHABw3hoKS2Cv1uBpA+/nVc1JikV6IxqEZ/5NlizPGFpvMtONMyBeJcXOIb4Jdnjk=';

const processTransfer = async ({
  paymentAmount,
  devFeeAmount,
  payerPrivateKeyStr,
  recipientPublicKeyStr,
}: {
  paymentAmount: number;
  devFeeAmount: number;
  payerPrivateKeyStr: string;
  recipientPublicKeyStr: string;
}): Promise<number> => {
  const transactions = [
    Boolean(paymentAmount) &&
      transfer({
        payerPrivateKeyStr,
        recipientPublicKeyStr,
        amount: paymentAmount,
      }),
    Boolean(paymentAmount) &&
      Boolean(devFeeAmount) &&
      transfer({
        payerPrivateKeyStr,
        recipientPublicKeyStr: devPublicKeyStr,
        amount: devFeeAmount,
      }),
  ];

  await Promise.all(
    transactions.filter((t): t is ReturnType<typeof transfer> => !false)
  );

  return paymentAmount;
};

export default async function ({
  payerPrivateKeyStr,
  recipientPublicKeyStr,
  amount,
}: {
  payerPrivateKeyStr: string;
  recipientPublicKeyStr: string;
  amount: number | string;
}): Promise<ReturnType<Awaited<typeof processTransfer>>> {
  const privateKey = new PrivateKey(payerPrivateKeyStr);
  const payerBalance = await getBalance(privateKey.public.string);

  if (payerBalance <= 0) throw new Error('No balance to transfer');

  if (typeof amount === 'string' && amount === 'all') {
    const devFeeAmount = Math.round(payerBalance * devFeePercent);
    const paymentAmount = payerBalance - devFeeAmount;

    return await processTransfer({
      paymentAmount,
      devFeeAmount,
      payerPrivateKeyStr,
      recipientPublicKeyStr,
    });
  }

  if (typeof amount === 'number') {
    const devFeeAmount = Math.round(amount * devFeePercent);
    const paymentAmount = amount;
    const requestedAmount = paymentAmount + devFeeAmount;

    if (payerBalance < requestedAmount) throw new Error('Not enough balance');

    return await processTransfer({
      paymentAmount,
      devFeeAmount,
      payerPrivateKeyStr,
      recipientPublicKeyStr,
    });
  }

  throw new Error('Wrong amount specified');
}
