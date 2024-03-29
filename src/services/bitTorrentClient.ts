import config from '../libs/config.js';
import BitTorrent from './BitTorrent.js';

const {
  BITTORRENT_GUI_URL,
  BITTORRENT_GUI_USERNAME,
  BITTORRENT_GUI_PASSWORD,
  BITTORRENT_PATH,
} = config;

export default new BitTorrent({
  guiUrl: BITTORRENT_GUI_URL,
  guiUsername: BITTORRENT_GUI_USERNAME,
  guiPassword: BITTORRENT_GUI_PASSWORD,
  installationPath: BITTORRENT_PATH,
});
