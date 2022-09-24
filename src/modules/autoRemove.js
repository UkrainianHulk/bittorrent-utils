import { setTimeout } from 'timers/promises'
import config from '../libs/config.js'
import bitTorrent from '../services/bitTorrentAccess.js'
import {
    msToDHMS,
    bytesToGB,
    GBtoBytes,
    setStringLength,
} from '../libs/utils.js'
import Logger from '../libs/Logger.js'

const {
    AUTOREMOVE_INTERVAL_SECONDS,
    AUTOREMOVE_TORRENTS_MAX_AMOUNT,
    AUTOREMOVE_TORRENT_MAX_SIZE_GB,
    AUTOREMOVE_DEDUPLICATION,
    AUTOREMOVE_PREVENT_REMOVING,
} = config

const log = new Logger('autoremove')

function extractDuplication(torrents, index = 0) {
    if (index >= torrents.length) return []
    const torrent = torrents[index]
    const rest = torrents.slice(index + 1, torrents.length)
    const duplicate = rest.find((item) => item.name === torrent.name)
    if (duplicate) {
        const eccess = torrents.splice(index, 1)[0]
        return [eccess, ...extractDuplication(torrents, index)]
    }
    return extractDuplication(torrents, ++index)
}

function extractSizeEccess(torrents, index = 0) {
    if (index >= torrents.length) return []
    const torrent = torrents[index]
    if (torrent.size > GBtoBytes(AUTOREMOVE_TORRENT_MAX_SIZE_GB)) {
        const eccess = torrents.splice(index, 1)[0]
        return [eccess, ...extractSizeEccess(torrents, index)]
    }
    return extractSizeEccess(torrents, ++index)
}

function extractAmountEccess(torrents) {
    torrents.sort((a, b) => b.added - a.added)
    if (torrents.length > AUTOREMOVE_TORRENTS_MAX_AMOUNT)
        return torrents.splice(
            AUTOREMOVE_TORRENTS_MAX_AMOUNT,
            torrents.length - AUTOREMOVE_TORRENTS_MAX_AMOUNT
        )
    return []
}

async function autoRemove() {
    const torrents = await bitTorrent.getTorrents()
    const duplicationList = []
    const removalList = []

    if (AUTOREMOVE_DEDUPLICATION)
        duplicationList.push(...extractDuplication(torrents))
    if (AUTOREMOVE_TORRENT_MAX_SIZE_GB)
        removalList.push(...extractSizeEccess(torrents))
    if (AUTOREMOVE_TORRENTS_MAX_AMOUNT)
        removalList.push(...extractAmountEccess(torrents))

    const duplicationListHashes = duplicationList.map((torrent) => torrent.hash)
    const removalListHashes = removalList.map((torrent) => torrent.hash)
    const generalRemovalList = removalList.concat(duplicationList)

    if (!generalRemovalList.length) return log.debug(`No torrents to remove`)

    log.info('Torrents removal list:')

    generalRemovalList.forEach((torrent) => {
        const name = setStringLength(torrent.name, 50)
        const size = bytesToGB(torrent.size).toFixed(2) + ' GB'
        const ratio = (torrent.ratio / 1000).toFixed(2)
        const status = torrent.status
        const added = msToDHMS(Date.now() - torrent.added * 1000)
        log.info('| ' + [name, size, ratio, status, added].join(' | '))
    })

    if (AUTOREMOVE_PREVENT_REMOVING)
        return log.info('Torrents removing prevented')

    await Promise.all([
        bitTorrent.deleteTorrents(duplicationListHashes, false),
        bitTorrent.deleteTorrents(removalListHashes),
    ])

    log.info('Torrents removed')
}

export async function start() {
    try {
        await autoRemove()
    } catch (error) {
        log.error(error.message)
        log.debug(error)
    } finally {
        await setTimeout(AUTOREMOVE_INTERVAL_SECONDS * 1000)
        await start()
    }
}
