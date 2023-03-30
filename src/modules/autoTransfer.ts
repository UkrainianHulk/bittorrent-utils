import { setTimeout } from 'node:timers/promises';
import chalk from 'chalk';
import Logger from '../libs/Logger.js';
import config from '../libs/config.js';
import bitTorrentSpeed from '../services/bitTorrentSpeedClient.js';
import inAppTransfer from './inAppTransfer.js';
import { getBalance } from '../services/ledger/index.js';
import { getBttPrice } from '../services/binance.js';
import { getPublicIp } from '../services/apify.js';
import influxDB from '../services/influxDBClient.js';
import { getLocalIp } from '../libs/utils.js';

const {
  AUTOTRANSFER_TO,
  AUTOTRANSFER_FROM,
  AUTOTRANSFER_INTERVAL_SECONDS,
  AUTOTRANSFER_INFLUXDB_ENABLED,
  AUTOTRANSFER_INFLUXDB_TAG,
} = config;

const log = new Logger('autotransfer');

const obtainPublicIp = (() => {
  let publicIp: string | undefined;

  return async function (): Promise<string> {
    if (publicIp !== undefined) return publicIp;
    publicIp = await getPublicIp();
    return publicIp;
  };
})();

const obtainLocalIp = (() => {
  let localIp: string | undefined;

  return function (): string {
    if (localIp !== undefined) return localIp;
    localIp = getLocalIp();
    return localIp;
  };
})();

async function getPayerPrivateKey(): Promise<string> {
  if (AUTOTRANSFER_FROM === 'local')
    return await bitTorrentSpeed.getPrivateKey();
  return AUTOTRANSFER_FROM;
}

async function autoTransfer(): Promise<void> {
  const payerPrivateKeyStr = await getPayerPrivateKey();
  const [price, paymentAmount] = await Promise.all([
    getBttPrice(),
    inAppTransfer({
      payerPrivateKeyStr,
      recipientPublicKeyStr: AUTOTRANSFER_TO,
      amount: 'all',
    }),
  ]);

  if (AUTOTRANSFER_INFLUXDB_ENABLED) {
    await influxDB.pushTransferData({
      tag: AUTOTRANSFER_INFLUXDB_TAG,
      localIp: obtainLocalIp(),
      publicIp: await obtainPublicIp(),
      amount: paymentAmount,
    });
  }

  const newRecipientBalance = await getBalance(AUTOTRANSFER_TO);
  const equivalent = (price * newRecipientBalance).toFixed(2);
  const equivalentStr = chalk.greenBright(
    equivalent.toLocaleString() + ' USDT'
  );
  const paymentAmountStr = chalk.magentaBright(
    paymentAmount.toLocaleString() + ' BTTC'
  );
  const newBalanceStr = chalk.magentaBright(
    newRecipientBalance.toLocaleString() + ' BTTC'
  );

  log.info(`${paymentAmountStr} -> ${newBalanceStr} (${equivalentStr})`);
}

export async function start(): Promise<void> {
  try {
    await autoTransfer();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'No balance to transfer') {
        log.debug(error.message);
        return;
      }
      log.error(error.message);
      if (error.stack != null) log.debug(error.stack);
    }
  } finally {
    await setTimeout(AUTOTRANSFER_INTERVAL_SECONDS * 1000);
    await start();
  }
}
