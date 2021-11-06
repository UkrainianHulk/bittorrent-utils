module.exports = {
    AUTOTRANSFER_INTERVAL_SECONDS: 1,
    AUTOTRANSFER_FROM: 'auto',
    AUTOTRANSFER_TO: "BFHYIrLExXfnWwdPCD827n6n/dhcU6d1TjL0xmbSb0977to4Zx5YOQ9vqkYxqTsQzjgZf2Pfltgt4Kt4cjmaeT0=",
    AUTOTRANSFER_HISTORY_AGE_HOURS: 24,

    CLIENTS: [{
        GUI_URL: 'http://localhost:80/gui/',   
        USERNAME: 'username',                
        PASSWORD: 'password',                
        IPFILTER_FILE_PATH: 'auto',
        BITTORRENT_SPEED_PORT_FILE_PATH: 'auto' 
    }],

    PEERS_FILTER_INTERVAL_SECONDS: 3,
    PEERS_FILTER_BITTORRENT_VERSION: '>=7.10.5',
    PEERS_FILTER_UTORRENT_VERSION: '>=3.5.5',
    PEERS_FILTER_LIBTORRENT_VERSION: '>=1.2.2',
    PEERS_FILTER_BANLIST_MAX_LENGTH: 1000,

    AUTOREMOVE_INTERVAL_SECONDS: 0,
    AUTOREMOVE_TORRENTS_MAX_AMOUNT: 30,
    AUTOREMOVE_SIZE_QUOTA_PER_DRIVE_GB: 0,
    AUTOREMOVE_PREVENT_REMOVING: false,

    AUTOCONFIG_ENABLE: false,
    AUTOCONFIG_SETTINGS: {
        max_active_torrent: 15,
        max_active_downloads: 3,
        conns_globally: 200,
        conns_per_torrent: 50,
        ul_slots_per_torrent: 1,
        encryption_mode: 1,
        seed_ratio: 0,
        max_dl_rate: 0,
        max_ul_rate: 0,
     // bind_port: 35000,
        rand_port_on_start: true,
        upnp: true,
        start_minimized: false,
        seeds_prioritized: false,
        dir_torrent_files_flag: true,
        dir_torrent_files: 'torrents',
        dir_autoload_flag: true,
        dir_autoload: 'autoload',
        dir_autoload_delete: true,
        dir_active_download_flag: false,
        dir_active_download: 'downloads',
        'cache.read': true,
        'cache.write': true,
        'rss.update_interval': 1,
        'offers.sponsored_torrent_offer_enabled': false,
        'offers.left_rail_offer_enabled': false
    },

    DEV_FEE_PERCENT: 1,
    LOG_LEVEL: 2,
}