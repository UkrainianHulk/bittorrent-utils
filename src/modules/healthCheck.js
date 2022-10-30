import process from 'process'
import childProcess from 'child_process'
import { setTimeout } from 'timers/promises'
import findProcess from 'find-process'
import Logger from '../libs/Logger.js'
import config from '../libs/config.js'
import bitTorrent from '../services/bitTorrentClient.js'

const {
    HEALTHCHECK_INTERVAL_SECONDS,
    HEALTHCHECK_FAILED_ATTEMPTS_BEFORE_RESTART,
    BITTORRENT_FILE_PATH,
} = config

const log = new Logger('health check')

let failedAttemps = 0

async function restartBitTorrent() {
    const bitTorrentProcesses = await findProcess('name', 'BitTorrent')
    for (const bitTorrentProcess of bitTorrentProcesses)
        process.kill(bitTorrentProcess.pid)
    childProcess.execFile(BITTORRENT_FILE_PATH, { detached: true })
}

async function healthCheck() {
    try {
        await bitTorrent.healthCheck()
        failedAttemps = 0
    } catch (error) {
        failedAttemps += 1
        log.warn(`Client is unreachable, failed attempts count: ${failedAttemps}`)
        if (failedAttemps >= HEALTHCHECK_FAILED_ATTEMPTS_BEFORE_RESTART)
            await restartBitTorrent()
        throw error
    }
}

export async function start() {
    try {
        await healthCheck()
    } catch (error) {
        log.error(error.message)
        log.debug(error)
    } finally {
        await setTimeout(HEALTHCHECK_INTERVAL_SECONDS * 1000)
        await start()
    }
}
