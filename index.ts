import config from './src/libs/config.js'
import log from 'loglevel'

const {
  AUTOTRANSFER_ENABLED,
  AUTOREMOVE_ENABLED,
  PEERS_FILTER_ENABLED,
  AUTOCONFIG_ENABLED,
  HEALTHCHECK_ENABLED,
} = config

if (AUTOTRANSFER_ENABLED)
  (await import('./src/modules/autoTransfer.js')).start().catch(log.error)
if (AUTOREMOVE_ENABLED)
  (await import('./src/modules/autoRemove.js')).start().catch(log.error)
if (PEERS_FILTER_ENABLED)
  (await import('./src/modules/peersFilter.js')).start().catch(log.error)
if (AUTOCONFIG_ENABLED)
  (await import('./src/modules/autoConfig.js')).start().catch(log.error)
if (HEALTHCHECK_ENABLED)
  (await import('./src/modules/healthCheck.js')).start().catch(log.error)
