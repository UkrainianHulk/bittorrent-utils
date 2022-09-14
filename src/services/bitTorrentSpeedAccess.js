import config from '../libs/config.js'
import BitTorrentSpeed from '../services/BitTorrentSpeed.js'

const {
    BITTORRENT_SPEED_PASSWORD,
    BITTORRENT_SPEED_PASSWORD_FORCED,
    BITTORRENT_SPEED_PORT_FILE_PATH,
} = config

const bitTorrentSpeed = new BitTorrentSpeed({
    password: BITTORRENT_SPEED_PASSWORD,
    passwordForced: BITTORRENT_SPEED_PASSWORD_FORCED,
    portFilePath: BITTORRENT_SPEED_PORT_FILE_PATH,
})

export default bitTorrentSpeed
