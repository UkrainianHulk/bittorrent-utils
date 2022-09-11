import { setTimeout } from 'timers/promises'
import config from '../libs/config.js'
import log from '../libs/log.js'
import bitTorrent from '../services/bitTorrentAccess.js'
import bitTorrentSpeed from '../services/bitTorrentSpeedAccess.js'

const { AUTOCONFIG_SETTINGS } = config

async function autoConfig() {
    await bitTorrent.setSettings(AUTOCONFIG_SETTINGS)
    log.info('BitTorrent settings applied')
    await bitTorrentSpeed.disableTokensSpending()
    log.info('Tokens spending disabled')
}

export async function start() {
    try {
        await autoConfig()
    } catch (error) {
        log.error(`Autoconfig: ${error.message}`)
        log.debug(error)
        log.warn('Will retry automatic configuration in 5 sec...')
        await setTimeout(5000)
        await start()
    }
}
