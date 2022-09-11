// eslint-disable-next-line no-unused-vars
import colors from 'colors'
import config from './config.js'
import log from 'loglevel'

const { LOG_LEVEL } = config

log.setDefaultLevel(LOG_LEVEL)

const getTimestampString = () =>
    new Date().toLocaleString('ru', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }).yellow

export default class logger {
    static trace = (msg) => log.trace(getTimestampString(), 'TRACE'.gray, msg)

    static debug = (msg) => log.debug(getTimestampString(), 'DEBUG'.gray, msg)

    static info = (msg) =>
        log.info(getTimestampString(), 'INFO'.brightBlue, msg)

    static warn = (msg) =>
        log.warn(getTimestampString(), 'WARN'.brightYellow, msg)

    static error = (msg) =>
        log.error(getTimestampString(), 'ERROR'.brightRed, msg)
}
