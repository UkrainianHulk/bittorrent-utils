const process = require('process')
const log = require('./log.js')

module.exports.isProduction = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'user'
module.exports.numberToPercent = (number) => (number > 0 ? number > 100 ? 100 : number : 0) / 100
module.exports.UBTTtoBTT = (amount) => amount / 1000000
module.exports.BTTtoUBTT = (amount) => amount * 1000000

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