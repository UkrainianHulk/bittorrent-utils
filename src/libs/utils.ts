import { networkInterfaces } from 'node:os';
import { setTimeout } from 'node:timers/promises';
import { type log } from 'loglevel';

export function numberToPercent(number: number): number {
  return (number > 0 ? (number > 100 ? 100 : number) : 0) / 100;
}

export function UBTTtoBTTC(amount: number): number {
  return amount / 1000;
}

export function BTTCtoUBTT(amount: number): number {
  return amount * 1000;
}

export function bytesToGB(bytes: number): number {
  return bytes / 1024 / 1024 / 1024;
}

export function GBtoBytes(GB: number): number {
  return GB * 1024 * 1024 * 1024;
}

export function msToDHMS(timeMs: number): string {
  const SEC = 1e3;
  const MIN = SEC * 60;
  const HOUR = MIN * 60;
  const DAY = HOUR * 24;
  const ms = Math.abs(timeMs);
  const d = (ms / DAY) | 0;
  const h = ((ms % DAY) / HOUR) | 0;
  const m = ((ms % HOUR) / MIN) | 0;
  const s = ((ms % MIN) / SEC) | 0;
  return `${timeMs < 0 ? '-' : ''}${d}d ${h}h ${m}m ${s}s`;
}

export function cropString(string: string, maxLength: number): string {
  return string.length > maxLength
    ? string.substring(0, maxLength - 3) + '...'
    : string.padEnd(maxLength, ' ');
}

export function getLocalIp(): string {
  const localIp = Object.values(networkInterfaces())
    .flat()
    .find((i) => i?.family === 'IPv4' && !i?.internal)?.address;
  if (localIp === undefined) throw new Error('Could not get local ip');
  return localIp;
}

export async function untilSuccess(
  func: () => Promise<any>,
  logger: typeof log,
  delay = 5000
): Promise<ReturnType<typeof func>> {
  try {
    return await func();
  } catch (error) {
    logger(error);
    await setTimeout(delay);
    return await untilSuccess(func, logger, delay);
  }
}
