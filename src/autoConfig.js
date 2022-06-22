const config = require('config')
const log = require('./libs/log.js')
const client = require('./client.js')

const settings = config.get('AUTOCONFIG_SETTINGS')

const setSettings = async (client) => {
    try {
        await client.bitTorrent.setSettings(settings)
        log.info(`Settings applied`)
        await client.bitTorrentSpeed.disableTokensSpending()
        log.info(`Tokens spending disabled`)
    } catch (error) {
        log.error(error.message)
    }
}

module.exports.start = () => setSettings(client)
