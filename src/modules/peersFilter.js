import { setTimeout } from 'timers/promises'
import semver from 'semver'
import config from '../libs/config.js'
import Logger from '../libs/Logger.js'
import bitTorrent from '../services/bitTorrentClient.js'

const {
    PEERS_FILTER_INTERVAL_SECONDS,
    PEERS_FILTER_RESET_INTERVAL_MINUTES,
    PEERS_FILTER_BITTORRENT_VERSION,
    PEERS_FILTER_UTORRENT_VERSION,
    PEERS_FILTER_LIBTORRENT_VERSION,
} = config

const log = new Logger('peers filter')
let ipFilterResetTimestamp = 0

async function peersFilter() {
    const nowTimestamp = Date.now()

    if (
        nowTimestamp - ipFilterResetTimestamp >
        PEERS_FILTER_RESET_INTERVAL_MINUTES * 60 * 1000
    ) {
        await bitTorrent.resetIpFilter()
        ipFilterResetTimestamp = nowTimestamp
        log.info('Peers filter reset')
    }

    const torrents = await bitTorrent.getTorrents()
    const torrentHashes = torrents.map((torrent) => torrent.hash)
    const peers = await bitTorrent.getPeers(torrentHashes)
    const unsuitablePeers = peers.filter((peer) =>
        isPeerUnsuitable(peer, torrents)
    )

    if (!unsuitablePeers.length) return

    await bitTorrent.addToIpsFilter(unsuitablePeers.map((peer) => peer.ip))
    await bitTorrent.reloadIpFilter()

    log.info(`Banned ${unsuitablePeers.length} new peer(s)`)
    log.debug(unsuitablePeers.map((peer) => peer.client).join(', '))
}

function parseClientVersion(clientName) {
    const match = clientName.match(/\d+\.\d+\.\d+/)
    return match ? match[0] : null
}

function isClientWithBTT(clientName) {
    const clientVersion = parseClientVersion(clientName)

    if (
        clientName.startsWith('BitTorrent') &&
        semver.satisfies(clientVersion, PEERS_FILTER_BITTORRENT_VERSION)
    )
        return true

    if (
        clientName.startsWith('μTorrent') &&
        semver.satisfies(clientVersion, PEERS_FILTER_UTORRENT_VERSION)
    )
        return true

    if (
        clientName.startsWith('libtorrent') &&
        semver.satisfies(clientVersion, PEERS_FILTER_LIBTORRENT_VERSION)
    )
        return true

    return false
}

function isPeerUnsuitable(peer, torrents) {
    const clientWithBTT = isClientWithBTT(peer.client)
    const torrentStatus = torrents.find(
        (torrent) => torrent.hash === peer.torrentHash
    ).status

    if (clientWithBTT) return false

    // status 201 - downloading
    if (torrentStatus === 201 && peer.uploaded === 0) return false

    return true
}

export async function start() {
    try {
        await peersFilter()
    } catch (error) {
        log.error(error.message)
        log.debug(error)
    } finally {
        await setTimeout(PEERS_FILTER_INTERVAL_SECONDS * 1000)
        await start()
    }
}
