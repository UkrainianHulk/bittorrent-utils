import log from 'loglevel';
import config from './config.js';
import chalk from 'chalk';

const { LOG_LEVEL } = config;

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
  )[LOG_LEVEL] ?? 'info';

log.setDefaultLevel(logLevel);

const timestamp = (): string => {
  const dateStr = new Date().toLocaleString('uk-UA', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return chalk.yellow(dateStr);
};

export class Logger {
  constructor(private readonly name: string = 'other') {}

  trace = (...msgs: unknown[]): void => {
    log.trace(timestamp(), chalk.gray('TRACE'), `[${this.name}]`, ...msgs);
  };

  debug = (...msgs: unknown[]): void => {
    log.debug(timestamp(), chalk.gray('DEBUG'), `[${this.name}]`, ...msgs);
  };

  info = (...msgs: unknown[]): void => {
    log.info(timestamp(), chalk.blue('INFO'), `[${this.name}]`, ...msgs);
  };

  warn = (...msgs: unknown[]): void => {
    log.warn(timestamp(), chalk.yellow('WARN'), `[${this.name}]`, ...msgs);
  };

  error = (...msgs: unknown[]): void => {
    log.error(timestamp(), chalk.red('ERROR'), `[${this.name}]`, ...msgs);
  };
}
