const process = require('process')
const log = require('./log.js')

module.exports.isProduction = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'user'
module.exports.numberToPercent = (number) => (number > 0 ? number > 100 ? 100 : number : 0) / 100
module.exports.UBTTtoBTT = (amount) => amount / 1000000
module.exports.BTTtoUBTT = (amount) => amount * 1000000
module.exports.bytesToGB = (bytes) => bytes / 1024 / 1024 / 1024
module.exports.GBtoBytes = (GB) => GB * 1024 * 1024 * 1024
module.exports.msToDHMS = (time)=>{
    const SEC = 1e3
    const MIN = SEC * 60
    const HOUR = MIN * 60
    const DAY = HOUR * 24
    const ms = Math.abs(time);
    const d = ms / DAY | 0;
    const h = ms % DAY / HOUR | 0;
    const m = ms % HOUR / MIN | 0;
    const s = ms % MIN / SEC | 0;
    return `${time < 0 ? "-" : ""}${d}d ${h}h ${m}m ${s}s`
}

module.exports.iteration = async function (func, delay, ...args) {
    if (!module.exports.isProduction) try {
        return await func(...args)
    } catch (error) {
        log.error(error.stack, func.name)
    } else try {
        await func(...args)
    } catch (error) {
        log.error(error.stack, func.name)
    } finally {
        await new Promise(resolve => setTimeout(resolve, delay))
        return await module.exports.iteration(func, delay, ...args)
    }
}