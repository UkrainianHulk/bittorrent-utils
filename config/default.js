import path from 'path'
import { env } from 'process'

const { APPDATA, LOCALAPPDATA } = env

export default {
  BITTORRENT_GUI_URL: 'http://localhost:8080/gui/',
  BITTORRENT_GUI_USERNAME: 'username',
  BITTORRENT_GUI_PASSWORD: 'password',
  BITTORRENT_PATH: path.join(APPDATA, '/BitTorrent'),
  BITTORRENT_SPEED_PATH: path.join(LOCALAPPDATA, '/BitTorrentHelper'),
  BITTORRENT_SPEED_PASSWORD: 'password',
  BITTORRENT_SPEED_PASSWORD_FORCED: true,

  AUTOTRANSFER_ENABLED: false,
  AUTOTRANSFER_FROM: 'local',
  AUTOTRANSFER_TO: 'BHGaoDov6gsuHbfk2Tc0cAyHABw3hoKS2Cv1uBpA+/nVc1JikV6IxqEZ/5NlizPGFpvMtONMyBeJcXOIb4Jdnjk=',
  AUTOTRANSFER_INTERVAL_SECONDS: 1,
  AUTOTRANSFER_HISTORY_AGE_HOURS: 24,
  AUTOTRANSFER_INFLUXDB_ENABLED: false,
  AUTOTRANSFER_INFLUXDB_URL: 'http://localhost:8086',
  AUTOTRANSFER_INFLUXDB_TOKEN: 'influxdb-token',
  AUTOTRANSFER_INFLUXDB_ORGANISATION: 'bittorrent-utils',
  AUTOTRANSFER_INFLUXDB_BUCKET: 'bittorrent-utils',
  AUTOTRANSFER_INFLUXDB_TAG: 'bittorrent-utils',

  AUTOREMOVE_ENABLED: false,
  AUTOREMOVE_INTERVAL_SECONDS: 15,
  AUTOREMOVE_TORRENTS_MAX_AMOUNT: 15,
  AUTOREMOVE_TORRENT_MAX_SIZE_GB: 15,
  AUTOREMOVE_DEDUPLICATION: true,
  AUTOREMOVE_PREVENT_REMOVING: false,

  PEERS_FILTER_ENABLED: false,
  PEERS_FILTER_INTERVAL_SECONDS: 5,
  PEERS_FILTER_RESET_INTERVAL_MINUTES: 5,
  PEERS_FILTER_BITTORRENT_VERSION: '>=7.10.5',
  PEERS_FILTER_UTORRENT_VERSION: '>=3.5.5',
  PEERS_FILTER_LIBTORRENT_VERSION: '>=1.2.3',

  HEALTHCHECK_ENABLED: false,
  HEALTHCHECK_INTERVAL_SECONDS: 60,
  HEALTHCHECK_FAILED_ATTEMPTS_BEFORE_RESTART: 5,

  AUTOCONFIG_ENABLED: false,
  AUTOCONFIG_DISABLE_TOKENS_SPENDING: true,
  AUTOCONFIG_SETTINGS: {
    bind_port: 0,
    'bt.allow_same_ip': false,
    'bt.connect_speed': 100,
    'bt.graceful_shutdown': true,
    'bt.transp_disposition': 31,
    close_to_tray: false,
    conns_globally: 1500,
    conns_per_torrent: 50,
    dir_active_download: 'path/to/downloads/dir',
    dir_active_download_flag: false,
    dir_autoload: 'path/to/autoload/dir',
    dir_autoload_delete: true,
    dir_autoload_flag: false,
    dir_torrent_files: 'torrents',
    dir_torrent_files_flag: true,
    encryption_mode: 1,
    max_active_downloads: 5,
    max_active_torrent: 15,
    max_dl_rate: 10000,
    max_ul_rate: 0,
    'net.max_halfopen': 100,
    'offers.left_rail_offer_enabled': false,
    'offers.sponsored_torrent_offer_enabled': false,
    'peer.disconnect_inactive_interval': 100,
    rand_port_on_start: true,
    'rss.update_interval': 5,
    seed_ratio: 0,
    show_category: false,
    show_toolbar: false,
    start_minimized: false,
    ul_slots_per_torrent: 1,
    upnp: true
  },

  DEV_FEE_PERCENT: 1,
  LOG_LEVEL: 2
}
