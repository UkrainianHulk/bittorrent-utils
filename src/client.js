const config = require('config')
const BitTorrent = require('./libs/BitTorrent.js')
const BitTorrentSpeed = require('./libs/BitTorrentSpeed.js')

const guiUrl = config.get('GUI_URL')
const guiUsername = config.get('GUI_USERNAME')
const guiPassword = config.get('GUI_PASSWORD')
const bitTorrentSpeedPortFilePath = config.get(
    'BITTORRENT_SPEED_PORT_FILE_PATH'
)

module.exports.bitTorrent = new BitTorrent({ guiUrl, guiUsername, guiPassword })
module.exports.bitTorrentSpeed = new BitTorrentSpeed(
    bitTorrentSpeedPortFilePath
)
