import { networkInterfaces } from 'node:os'

export function numberToPercent(number) {
  return (number > 0 ? (number > 100 ? 100 : number) : 0) / 100
}

export function UBTTtoBTT(amount) {
  return amount / 1000
}

export function BTTtoUBTT(amount) {
  return amount * 1000
}

export function bytesToGB(bytes) {
  return bytes / 1024 / 1024 / 1024
}

export function GBtoBytes(GB) {
  return GB * 1024 * 1024 * 1024
}

export function msToDHMS(time) {
  const SEC = 1e3
  const MIN = SEC * 60
  const HOUR = MIN * 60
  const DAY = HOUR * 24
  const ms = Math.abs(time)
  const d = (ms / DAY) | 0
  const h = ((ms % DAY) / HOUR) | 0
  const m = ((ms % HOUR) / MIN) | 0
  const s = ((ms % MIN) / SEC) | 0
  return `${time < 0 ? '-' : ''}${d}d ${h}h ${m}m ${s}s`
}

export function setStringLength(string, maxLength) {
  return string.length > maxLength ? string.substring(0, maxLength - 3) + '...' : string.padEnd(maxLength, ' ')
}

export function getLocalIp() {
  return Object.values(networkInterfaces())
    .flat()
    .find((i) => i?.family === 'IPv4' && !i?.internal)?.address
}
