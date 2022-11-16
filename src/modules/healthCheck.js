import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { execFile } from 'node:child_process'
import { setTimeout } from 'timers/promises'
import findProcess from 'find-process'
import Logger from '../libs/Logger.js'
import config from '../libs/config.js'
import bitTorrent from '../services/bitTorrentClient.js'
import BitTorrentSpeed from '../services/BitTorrentSpeed.js'

const {
  HEALTHCHECK_INTERVAL_SECONDS,
  HEALTHCHECK_FAILED_ATTEMPTS_BEFORE_RESTART,
  BITTORRENT_PATH,
  BITTORRENT_SPEED_PATH
} = config

const log = new Logger('health check')
const bitTorrentFilePath = path.join(BITTORRENT_PATH, 'BitTorrent.exe')
let failedAttemps = 0

async function killBitTorrent() {
  const bitTorrentProcesses = await findProcess('name', 'BitTorrent')
  for (const bitTorrentProcess of bitTorrentProcesses) process.kill(bitTorrentProcess.pid)
}

async function removeBitTorrentHelperData() {
  return await fs.rm(BITTORRENT_SPEED_PATH, { recursive: true, force: true })
}

async function healthCheck() {
  try {
    Promise.all([await bitTorrent.healthCheck(), await BitTorrentSpeed.getStatus()])
    failedAttemps = 0
  } catch (error) {
    failedAttemps += 1
    log.warn(`Health check failed, attempts count: ${failedAttemps}`)
    if (failedAttemps >= HEALTHCHECK_FAILED_ATTEMPTS_BEFORE_RESTART) {
      await killBitTorrent()
      await removeBitTorrentHelperData()
      execFile(bitTorrentFilePath)
      failedAttemps = 0
    }
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
