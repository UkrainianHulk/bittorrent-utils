import { setTimeout } from 'node:timers/promises';
import semver from 'semver';
import config from '../libs/config.js';
import Logger from '../libs/Logger.js';
import bitTorrent from '../services/bitTorrentClient.js';
import type { Peer, Torrent } from '../services/BitTorrent.js';

const {
  PEERS_FILTER_INTERVAL_SECONDS,
  PEERS_FILTER_RESET_INTERVAL_MINUTES,
  PEERS_FILTER_BITTORRENT_VERSION,
  PEERS_FILTER_UTORRENT_VERSION,
  PEERS_FILTER_LIBTORRENT_VERSION,
} = config;

const log = new Logger('peers filter');
let ipFilterResetTimestamp = 0;

async function peersFilter(): Promise<void> {
  const nowTimestamp = Date.now();

  if (
    nowTimestamp - ipFilterResetTimestamp >
    PEERS_FILTER_RESET_INTERVAL_MINUTES * 60 * 1000
  ) {
    await bitTorrent.resetIpFilter();
    ipFilterResetTimestamp = nowTimestamp;
    log.info('Peers filter reset');
  }

  const torrents = await bitTorrent.getTorrents();
  const torrentHashes = torrents.map((torrent) => torrent.hash);
  const peers = await bitTorrent.getPeers(torrentHashes);
  const unsuitablePeers = peers.filter((peer) =>
    isPeerUnsuitable(peer, torrents)
  );

  if (unsuitablePeers.length === 0) return;

  await bitTorrent.addToIpsFilter(unsuitablePeers.map((peer) => peer.ip));
  await bitTorrent.reloadIpFilter();

  log.info(
    `Banned ${unsuitablePeers.length} new peer(s): ${unsuitablePeers
      .map((peer) => peer.clientName)
      .join(', ')}`
  );
}

function isClientWithBTT(clientName: string): boolean {
  const clientVersion = semver.coerce(clientName);
  if (clientVersion === null) return false;

  const clientsVersions = {
    BitTorrent: PEERS_FILTER_BITTORRENT_VERSION,
    μTorrent: PEERS_FILTER_UTORRENT_VERSION,
    libtorrent: PEERS_FILTER_LIBTORRENT_VERSION,
  };

  for (const name in clientsVersions) {
    const isVersionSatisfies = semver.satisfies(
      clientVersion,
      clientsVersions[name as keyof typeof clientsVersions]
    );
    if (clientName.startsWith(name) && isVersionSatisfies) return true;
  }

  return false;
}

function isPeerUnsuitable(peer: Peer, torrents: Torrent[]): boolean {
  const clientWithBTT = isClientWithBTT(peer.clientName);
  if (clientWithBTT) return false;

  const torrentStatus = torrents.find(
    (torrent) => torrent.hash === peer.torrentHash
  )?.statusCode;

  // status 201 - downloading
  if (torrentStatus === 201 && peer.uploadedBytes === 0) return false;

  return true;
}

export async function start(): Promise<void> {
  try {
    await peersFilter();
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
      if (error.stack != null) log.debug(error.stack);
    }
  } finally {
    await setTimeout(PEERS_FILTER_INTERVAL_SECONDS * 1000);
    await start();
  }
}
