import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { execFile } from 'node:child_process';
import { setTimeout } from 'timers/promises';
import findProcess from 'find-process';
import Logger from '../libs/Logger.js';
import config from '../libs/config.js';
import bitTorrentClient from '../services/bitTorrentClient.js';
import bitTorrentSpeedClient from '../services/bitTorrentSpeedClient.js';

const {
  HEALTHCHECK_INTERVAL_SECONDS,
  HEALTHCHECK_FAILED_ATTEMPTS_BEFORE_RESTART,
  BITTORRENT_PATH,
  BITTORRENT_SPEED_PATH,
} = config;

const log = new Logger('health check');
const bitTorrentFilePath = path.join(BITTORRENT_PATH, 'BitTorrent.exe');

async function killBitTorrent(): Promise<void> {
  const bitTorrentProcesses = await findProcess('name', 'BitTorrent');
  for (const bitTorrentProcess of bitTorrentProcesses)
    process.kill(bitTorrentProcess.pid);
}

async function removeBitTorrentHelperData(): Promise<void> {
  await fs.rm(BITTORRENT_SPEED_PATH, { recursive: true, force: true });
}

async function reset(): Promise<void> {
  await killBitTorrent();
  await removeBitTorrentHelperData();
  bitTorrentClient.resetAuth();
  bitTorrentSpeedClient.resetAuth();
  execFile(bitTorrentFilePath);
}

const healthCheck = (() => {
  let failedAttempts = 0;

  return async function(): Promise<void> {
    try {
      await Promise.all([
        bitTorrentClient.healthCheck(),
        bitTorrentSpeedClient.getStatus(),
      ]);
      failedAttempts = 0;
    } catch (error) {
      failedAttempts += 1;
      log.warn(`Health check failed, attempts count: ${failedAttempts}`);
      if (failedAttempts >= HEALTHCHECK_FAILED_ATTEMPTS_BEFORE_RESTART) {
        await reset();
        failedAttempts = 0;
      }
      throw error;
    }
  }
})();

export async function start(): Promise<void> {
  try {
    await healthCheck();
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
      if (error.stack != null) log.debug(error.stack);
    }
  } finally {
    await setTimeout(HEALTHCHECK_INTERVAL_SECONDS * 1000);
    await start();
  }
}
