import log from 'loglevel'
import config from './config.js'
import chalk from 'chalk'

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

const timestamp = (): string => {
  const dateStr = new Date().toLocaleString('ru', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return chalk.yellow(dateStr);
}

export default class Logger {
  #name

  constructor(name = 'other') {
    this.#name = name
  }

  trace = (msg: string): void => {
    log.trace(timestamp(), chalk.gray('TRACE'), `[${this.#name}]`, msg)
  }

  debug = (msg: string): void => {
    log.debug(timestamp(), chalk.gray('DEBUG'), `[${this.#name}]`, msg)
  }

  info = (msg: string): void => {
    log.info(timestamp(), chalk.blue('INFO'), `[${this.#name}]`, msg)
  }

  warn = (msg: string): void => {
    log.warn(timestamp(), chalk.yellow('WARN'), `[${this.#name}]`, msg)
  }

  error = (msg: string): void => {
    log.error(timestamp(), chalk.red('ERROR'), `[${this.#name}]`, msg)
  }
}
