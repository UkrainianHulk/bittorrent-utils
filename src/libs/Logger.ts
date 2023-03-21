import 'colors'
import log from 'loglevel'
import config from './config.js'

const { LOG_LEVEL } = config

const logLevel =
  (
    {
      TRACE: 'trace',
      DEBUG: 'debug',
      INFO: 'info',
      WARN: 'warn',
      ERROR: 'error',
      SILENT: 'silent',
    } as const
  )[LOG_LEVEL] ?? 'info'

log.setDefaultLevel(logLevel)

const timestamp = (): string =>
  new Date().toLocaleString('ru', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).yellow

export default class Logger {
  #name

  constructor(name = 'other') {
    this.#name = name
  }

  trace = (msg: string): void => {
    log.trace(timestamp(), 'TRACE'.gray, `[${this.#name}]`, msg)
  }

  debug = (msg: string): void => {
    log.debug(timestamp(), 'DEBUG'.gray, `[${this.#name}]`, msg)
  }

  info = (msg: string): void => {
    log.info(timestamp(), 'INFO'.blue, `[${this.#name}]`, msg)
  }

  warn = (msg: string): void => {
    log.warn(timestamp(), 'WARN'.yellow, `[${this.#name}]`, msg)
  }

  error = (msg: string): void => {
    log.error(timestamp(), 'ERROR'.red, `[${this.#name}]`, msg)
  }
}
