import config from './src/libs/config.js'

const {
    AUTOTRANSFER_ENABLED,
    AUTOREMOVE_ENABLED,
    PEERS_FILTER_ENABLED,
    AUTOCONFIG_ENABLED,
    HEALTHCHECK_ENABLED,
} = config

if (AUTOTRANSFER_ENABLED)
    (await import('./src/modules/autoTransfer.js')).start()
if (AUTOREMOVE_ENABLED) (await import('./src/modules/autoRemove.js')).start()
if (PEERS_FILTER_ENABLED) (await import('./src/modules/peersFilter.js')).start()
if (AUTOCONFIG_ENABLED) (await import('./src/modules/autoConfig.js')).start()
if (HEALTHCHECK_ENABLED) (await import('./src/modules/healthCheck.js')).start()
