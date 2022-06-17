const config = require('config')
const process = require('process')
const log = require('./src/libs/log.js')

log.debug(`Environment: ${process.env.NODE_ENV}`)

try {
    config.get('AUTOTRANSFER_INTERVAL_SECONDS') && require('./src/autoTransfer.js').start()
    config.get('AUTOREMOVE_INTERVAL_SECONDS')   && require('./src/autoRemove.js').start()
    config.get('PEERS_FILTER_INTERVAL_SECONDS') && require('./src/peersFilter.js').start()
    config.get('AUTOCONFIG_ENABLE')             && require('./src/autoConfig.js').start()
} catch (error) {
    console.error(error)
}