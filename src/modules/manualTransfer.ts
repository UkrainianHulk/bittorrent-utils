import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline/promises';
import chalk from 'chalk';

import config from '../libs/config.js';
import inAppTransfer from './inAppTransfer.js';
import { numberToPercent } from '../libs/utils.js';
import { PublicKey, PrivateKey } from '../libs/keys.js';
import { getBalance } from '../services/ledger/index.js';

const rl = createInterface({
  input: stdin,
  output: stdout,
  terminal: false,
});

const { DEV_FEE_PERCENT } = config;
const devFeePercent = numberToPercent(DEV_FEE_PERCENT);

const askPayer = async (): Promise<PrivateKey> => {
  const privateKey = await rl.question(`Enter payer's SPEED private key:\n`);
  try {
    return new PrivateKey(privateKey);
  } catch (error) {
    if (error instanceof Error) console.log(chalk.redBright(error.message));
    return await askPayer();
  }
};

const askRecipient = async (): Promise<PublicKey> => {
  const publicKey = await rl.question(`Enter recipient's SPEED public key:\n`);
  try {
    return new PublicKey(publicKey);
  } catch (error) {
    if (error instanceof Error) console.log(chalk.redBright(error.message));
    return await askRecipient();
  }
};

const askAmount = async (balance: number): Promise<number> => {
  const amount = await rl.question(`Enter BTTC amount:\n`);
  const isAmountCorrect = /^\d+([,.]\d{1,6})?$/.test(amount);

  if (!isAmountCorrect) {
    console.error(chalk.redBright('Enter correct amount'));
    return await askAmount(balance);
  }

  const amountInt = parseFloat(amount.replace(',', '.'));

  if (amountInt === 0) {
    console.error(chalk.redBright(`Amount cant be zero`));
    return await askAmount(balance);
  }

  if (balance < devFeePercent * amountInt + amountInt) {
    console.error(
      chalk.redBright(
        `Not anough balance ${
          devFeePercent > 0 ? 'considering the commission' : ''
        }`
      )
    );
    return await askAmount(balance);
  }

  return amountInt;
};

const askConfirmation = async (): Promise<boolean> => {
  const confirmation = await rl.question(
    `Type "YES" to confirm the transaction:\n`
  );

  if (confirmation !== 'YES') {
    console.error(
      chalk.redBright(`Wrong confirmation. Please type "YES" or close the app`)
    );
    return await askConfirmation();
  }

  return true;
};

async function run(): Promise<void> {
  console.log(`You have launched the BTTC in-app transfer utility.`);
  console.log(
    chalk.cyan(
      `Follow the program prompts and ` + `remember to check input data twice!`
    )
  );
  const payer = await askPayer();
  rl.pause();
  const payerBalance = await getBalance(payer.public.string);
  console.log(
    chalk.magentaBright(`Payer's balance: ` + payerBalance.toLocaleString())
  );
  rl.resume();
  const recipient = await askRecipient();
  const amount = await askAmount(payerBalance);
  const devFeeAmount = devFeePercent * amount;

  console.log(
    chalk.cyan(
      `
    Payer: ${payer.string}
    Recipient: ${recipient.string}
    Amount: ${amount.toLocaleString()}
    DevFee: ${devFeeAmount} (${DEV_FEE_PERCENT.toFixed(2)}%)
    Total: ${(amount + devFeeAmount).toLocaleString()}
`
    )
  );

  const confirmation = await askConfirmation();

  if (confirmation) {
    const paidAmount = await inAppTransfer({
      payerPrivateKeyStr: payer.string,
      recipientPublicKeyStr: recipient.string,
      amount,
    });
    console.log(
      chalk.green('Success! ') +
        'Paid amount: ' +
        chalk.magentaBright(paidAmount.toLocaleString())
    );
  }

  rl.close();
}

await run();
