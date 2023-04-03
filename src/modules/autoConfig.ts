import { setTimeout } from 'node:timers/promises';
import config from '../libs/config.js';
import Logger from '../libs/Logger.js';
import bitTorrent from '../services/bitTorrentClient.js';
import bitTorrentSpeed from '../services/bitTorrentSpeedClient.js';

const { AUTOCONFIG_SETTINGS } = config;

const log = new Logger('autoconfig');

async function autoConfig(): Promise<void> {      
  await bitTorrent.setSettings(AUTOCONFIG_SETTINGS);
  log.info('BitTorrent settings applied');
  await bitTorrentSpeed.disableTokensSpending();
  log.info('Tokens spending disabled');
}

export async function start(): Promise<void> {
  try {
    await autoConfig();
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
      if (error.stack != null) log.debug(error.stack);
    }
    log.warn('Will retry automatic configuration in 5 sec...');
    await setTimeout(5000);
    await start();
  }
}
