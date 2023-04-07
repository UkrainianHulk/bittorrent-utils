import config from '../libs/config.js';
import BitTorrentSpeed from './BitTorrentSpeed.js';

const {
  BITTORRENT_SPEED_PASSWORD,
  BITTORRENT_SPEED_PASSWORD_FORCED,
  BITTORRENT_SPEED_PATH,
} = config;

export default new BitTorrentSpeed({
  password: BITTORRENT_SPEED_PASSWORD,
  passwordForced: BITTORRENT_SPEED_PASSWORD_FORCED,
  installationPath: BITTORRENT_SPEED_PATH,
});
