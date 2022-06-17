const path = require('path')
const config = require('config')
const log = require('./libs/log.js')
const clients = require ('./clients.js')
const { iteration, bytesToGB, GBtoBytes, msToDHMS, setStringLength } = require('./libs/utils.js')

const torrentsMaxAmount   = config.get('AUTOREMOVE_TORRENTS_MAX_AMOUNT')
const sizeQuotaPerDriveGB = config.get('AUTOREMOVE_SIZE_QUOTA_PER_DRIVE_GB')
const minSeedingTimeHours = config.get('AUTOREMOVE_MIN_SEEDING_TIME_HOURS')
const preventRemoving     = config.get('AUTOREMOVE_PREVENT_REMOVING')
const intervalSeconds     = config.get('AUTOREMOVE_INTERVAL_SECONDS')

const getListsPerDrive = (torrentsList) => torrentsList.reduce((acc, torrent) => {
    const torrentRoot = path.parse(torrent.path).root
    if (!acc[torrentRoot]) {
        acc[torrentRoot] = [torrent]
    } else {
        acc[torrentRoot].push(torrent)
    }
    return acc
}, {})

const filterBySizeQuota = (torrentsList, sizeQuota) => {
    const torrentsTotalSize = torrentsList.reduce((acc, torrent) => acc+= torrent.size, 0)

    if (torrentsTotalSize > sizeQuota) {
        const exccess = torrentsTotalSize - sizeQuota
        const filteredList = []
        
        do {
            if (torrentsList.length === 0) {
                log.warn('Nothing to delete. But there is not enough space for the desired downloads')
                break
            }
            const torrent = torrentsList.pop()
            if (torrent.coefficient === 0) continue
            filteredList.push(torrent)
        } while (filteredList.reduce((acc, torrent) => acc += torrent.size, 0) < exccess)
        
        return { filteredList, torrentsTotalSize, exccess }
    }

    return { filteredList: [], torrentsTotalSize }
}

const filterByMaxAmount = (torrentsList, maxAmount) => {
    if (torrentsList.length > maxAmount) return torrentsList.slice(maxAmount, torrentsList.length)
    else return []
}

const autoRemove = async (client) => {
    const torrentsList = await client.getList()
    const sortedList = torrentsList.sort((a, b) => b.added - a.added)
    const removalList = []

    torrentsList.forEach((torrent) => {
        torrent.seedingTime = Date.now() - torrent.completed * 1000
    })

    if (torrentsMaxAmount) {
        const maxAmount = torrentsMaxAmount
        const filteredList = filterByMaxAmount(sortedList, maxAmount)
        if (filteredList.length > 0) {
            log.info(`Client #${client.index}: torrents amount - ${torrentsList.length} of ${maxAmount}, exccess = ${filteredList.length}`)
        } else {
            log.debug(`Client #${client.index}: torrents amount - ${torrentsList.length} of ${maxAmount}`)
        }
        removalList.push(...filteredList)
    }

    if (sizeQuotaPerDriveGB) {
        const listsPerDrive = getListsPerDrive(sortedList)
        const sizeQuota = GBtoBytes(client.settings.SIZE_QUOTA_PER_DRIVE_GB ? client.settings.SIZE_QUOTA_PER_DRIVE_GB : sizeQuotaPerDriveGB)
        const filteredList = []
        for (const drive in listsPerDrive) {
            const torrentsList = listsPerDrive[drive]
            const { filteredList: filteredDriveList, exccess, torrentsTotalSize } = filterBySizeQuota(torrentsList, sizeQuota)
            if (filteredDriveList.length > 0) {
                log.info(`Client #${client.index}, ${drive} - ${bytesToGB(torrentsTotalSize).toFixed(2)}/${bytesToGB(sizeQuota).toFixed(2)}GB, exccess = ${bytesToGB(exccess).toFixed(2)}GB`)
                filteredList.push(...filteredDriveList)
            } else {
                log.debug(`Client #${client.index}, torrents size at drive ${drive} - ${bytesToGB(torrentsTotalSize).toFixed(2)}GB of ${bytesToGB(sizeQuota).toFixed(2)}GB`)
            }
        }
        removalList.push(...filteredList)
    }

    let uniqueRemovalList = removalList.filter((item, index, self) => self.findIndex(i => i.hash === item.hash) === index)

    if (minSeedingTimeHours) {
        const minSeedingTimeMS = minSeedingTimeHours * 60 * 60 * 1000
        const currentTime = Date.now()

        uniqueRemovalList = uniqueRemovalList.filter((torrent) => {
            const seedingTime = currentTime - torrent.completed * 1000
            if (seedingTime < minSeedingTimeMS) {
                log.info(`Prevented removing of "${setStringLength(torrent.name, 60)}" - low seeding time: ${Math.floor(torrent.seedingTime / 1000 / 60 / 60)}/${minSeedingTimeHours}h`)
                return false
            } else return true
        })
    }
    
    const uniqueRemovalHashList = uniqueRemovalList.map((item) => item.hash)

    if (uniqueRemovalHashList.length > 0) {

        log.info('Torrents to remove:')
        console.table(uniqueRemovalList.map(t => ({
            name: setStringLength(t.name, 80),
            drive: path.parse(t.path).root,
            size: bytesToGB(t.size).toFixed(2) + ' GB',
            ratio: t.ratio / 1000,
            seedingTime: msToDHMS(t.seedingTime)
        })))
        if (!preventRemoving) await client.deleteTorrents(uniqueRemovalHashList)
    }
}

const autoRemoveIteration = (...args) => iteration(autoRemove, intervalSeconds * 1000, ...args)

module.exports.start = () => Promise.all(clients.map(autoRemoveIteration))