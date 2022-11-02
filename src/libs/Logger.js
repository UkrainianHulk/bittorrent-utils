import 'colors'
import log from 'loglevel'
import config from './config.js'

const { LOG_LEVEL } = config

log.setDefaultLevel(LOG_LEVEL)

const timestamp = () =>
  new Date().toLocaleString('ru', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).yellow

export default class Logger {
  #name

  constructor(name = 'other') {
    this.#name = name
  }

  trace = (msg) => log.trace(timestamp(), 'TRACE'.gray, `[${this.#name}]`, msg)

  debug = (msg) => log.debug(timestamp(), 'DEBUG'.gray, `[${this.#name}]`, msg)

  info = (msg) =>
    log.info(timestamp(), 'INFO'.brightBlue, `[${this.#name}]`, msg)

  warn = (msg) =>
    log.warn(timestamp(), 'WARN'.brightYellow, `[${this.#name}]`, msg)

  error = (msg) =>
    log.error(timestamp(), 'ERROR'.brightRed, `[${this.#name}]`, msg)
}
