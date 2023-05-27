import { setTimeout } from 'node:timers/promises';
import config from '../libs/config.js';
import bitTorrent from '../services/bitTorrentClient.js';
import { msToDHMS, bytesToGB, GBtoBytes, cropString } from '../libs/utils.js';
import { Logger } from '../libs/Logger.js';
import { type Torrent } from '../services/BitTorrent.js';

const {
  AUTOREMOVE_INTERVAL_SECONDS,
  AUTOREMOVE_TORRENTS_MAX_AMOUNT,
  AUTOREMOVE_TORRENT_MAX_SIZE_GB,
  AUTOREMOVE_DEDUPLICATION,
  AUTOREMOVE_PREVENT_REMOVING,
} = config;

const log = new Logger('autoremove');

function extractDuplication(torrents: Torrent[], index = 0): Torrent[] {
  if (index >= torrents.length) return [];
  const torrent = torrents[index];
  const rest = torrents.slice(index + 1, torrents.length);
  const duplicate = rest.find((item) => item.name === torrent.name);
  if (duplicate !== undefined) {
    const excess = torrents.splice(index, 1)[0];
    return [excess, ...extractDuplication(torrents, index)];
  }
  return extractDuplication(torrents, ++index);
}

function extractSizeExcess(torrents: Torrent[], index = 0): Torrent[] {
  if (index >= torrents.length) return [];
  const torrent = torrents[index];
  if (torrent.size > GBtoBytes(AUTOREMOVE_TORRENT_MAX_SIZE_GB)) {
    const excess = torrents.splice(index, 1)[0];
    return [excess, ...extractSizeExcess(torrents, index)];
  }
  return extractSizeExcess(torrents, ++index);
}

function extractAmountExcess(torrents: Torrent[]): Torrent[] {
  torrents.sort((a, b) => b.addedTimestamp - a.addedTimestamp);
  if (torrents.length > AUTOREMOVE_TORRENTS_MAX_AMOUNT) {
    return torrents.splice(
      AUTOREMOVE_TORRENTS_MAX_AMOUNT,
      torrents.length - AUTOREMOVE_TORRENTS_MAX_AMOUNT
    );
  }
  return [];
}

async function autoRemove(): Promise<void> {
  const torrents = await bitTorrent.getTorrents();
  const duplicationList = [];
  const removalList = [];

  if (AUTOREMOVE_DEDUPLICATION) {
    duplicationList.push(...extractDuplication(torrents));
  }
  if (AUTOREMOVE_TORRENT_MAX_SIZE_GB !== 0) {
    removalList.push(...extractSizeExcess(torrents));
  }
  if (AUTOREMOVE_TORRENTS_MAX_AMOUNT !== 0) {
    removalList.push(...extractAmountExcess(torrents));
  }

  const duplicationListHashes = duplicationList.map((torrent) => torrent.hash);
  const removalListHashes = removalList.map((torrent) => torrent.hash);
  const generalRemovalList = removalList.concat(duplicationList);

  if (generalRemovalList.length === 0) {
    log.debug('No torrents to remove');
    return;
  }

  log.info('Torrents removal list:');

  generalRemovalList.forEach((torrent) => {
    const name = cropString(torrent.name, 50);
    const size = bytesToGB(torrent.size).toFixed(2) + ' GB';
    const ratio = (torrent.ratio / 1000).toFixed(2);
    const status = torrent.statusText;
    const added = msToDHMS(Date.now() - torrent.addedTimestamp * 1000);
    log.info('| ' + [name, size, ratio, status, added].join(' | '));
  });

  if (AUTOREMOVE_PREVENT_REMOVING) {
    log.info('Torrents removing prevented');
    return;
  }

  await Promise.all([
    bitTorrent.deleteTorrents(duplicationListHashes, false),
    bitTorrent.deleteTorrents(removalListHashes),
  ]);

  log.info('Torrents removed');
}

export async function start(): Promise<void> {
  try {
    await autoRemove();
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
      if (error.stack != null) log.debug(error.stack);
    }
  } finally {
    await setTimeout(AUTOREMOVE_INTERVAL_SECONDS * 1000);
    await start();
  }
}
