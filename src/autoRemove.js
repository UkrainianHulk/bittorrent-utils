const path = require('path')
const config = require('config')
const log = require('./libs/log.js')
const clients = require ('./clients.js')
const { iteration, bytesToGB, GBtoBytes, msToDHMS, setStringLength } = require('./libs/utils.js')

const torrentsMaxAmount   = config.get('AUTOREMOVE_TORRENTS_MAX_AMOUNT')
const sizeQuotaPerDriveGB = config.get('AUTOREMOVE_SIZE_QUOTA_PER_DRIVE_GB')
const torrentMaxSizeGB    = config.get('AUTOREMOVE_TORRENT_MAX_SIZE_GB')
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

const findExcessBySizeQuota = (torrentsList, sizeQuota) => {
    const torrentsTotalSize = torrentsList.reduce((acc, torrent) => acc+= torrent.size, 0)

    if (torrentsTotalSize > sizeQuota) {
        const excessSize = torrentsTotalSize - sizeQuota
        const excessList = []
        
        do {
            if (torrentsList.length === 0) {
                log.warn('Nothing to delete. But there is not enough space for the desired downloads')
                break
            }
            const torrent = torrentsList.pop()
            if (torrent.coefficient === 0) continue
            excessList.push(torrent)
        } while (excessList.reduce((acc, torrent) => acc += torrent.size, 0) < excessSize)
        
        return { excessList, torrentsTotalSize, excessSize }
    }

    return { excessList: [], torrentsTotalSize }
}

const findExcessByMaxAmount = (torrentsList, maxAmount) => {
    if (torrentsList.length > maxAmount) return torrentsList.slice(maxAmount, torrentsList.length)
    else return []
}

const autoRemove = async (client) => {
    const torrentsList = await client.getList()
    const sortedList = torrentsList.sort((a, b) => b.added - a.added)
    const removalList = []

    for (torrent of torrentsList) {
        torrent.seedingTime = torrent.completed && Date.now() - torrent.completed * 1000
    }

    if (torrentMaxSizeGB) {
        for (let i = 0; i < sortedList.length; i++) {
            const torrent = sortedList[i]
            if (torrent.size > GBtoBytes(torrentMaxSizeGB)) {
                const exceedTorrent = sortedList.splice(i--, 1)[0]
                exceedTorrent.removeReason = 'MAX_SIZE'
                removalList.push(exceedTorrent)
            }
        }
    }

    if (torrentsMaxAmount) {
        const excessList = findExcessByMaxAmount(sortedList, torrentsMaxAmount)
        if (excessList.length > 0) {
            log.info(`Client #${client.index}: torrents amount - ${sortedList.length} of ${torrentsMaxAmount}, excess = ${excessList.length}`)
        } else {
            log.debug(`Client #${client.index}: torrents amount - ${sortedList.length} of ${torrentsMaxAmount}`)
        }
        excessList.forEach(t => t.removeReason = 'MAX_AMOUNT')
        removalList.push(...excessList)
    }

    if (sizeQuotaPerDriveGB) {
        const listsPerDrive = getListsPerDrive(sortedList)
        const sizeQuota = GBtoBytes(client.settings.SIZE_QUOTA_PER_DRIVE_GB ? client.settings.SIZE_QUOTA_PER_DRIVE_GB : sizeQuotaPerDriveGB)
        const excessList = []
        for (const drive in listsPerDrive) {
            const torrentsListOnDrive = listsPerDrive[drive]
            const { excessList: excessListOnDrive, excessSize, torrentsTotalSize } = findExcessBySizeQuota(torrentsListOnDrive, sizeQuota)
            if (excessListOnDrive.length > 0) {
                log.info(`Client #${client.index}, ${drive} - ${bytesToGB(torrentsTotalSize).toFixed(2)}/${bytesToGB(sizeQuota).toFixed(2)}GB, excess = ${bytesToGB(excessSize).toFixed(2)}GB`)
                excessList.push(...excessListOnDrive)
            } else {
                log.debug(`Client #${client.index}, torrents size at drive ${drive} - ${bytesToGB(torrentsTotalSize).toFixed(2)}GB of ${bytesToGB(sizeQuota).toFixed(2)}GB`)
            }
        }
        excessList.forEach(t => t.removeReason = 'SIZE_QUOTA')
        removalList.push(...excessList)
    }

    const uniqueRemovalList = removalList.filter((item, index, self) => self.findIndex(i => i.hash === item.hash) === index)
    
    // Prevent removing torrents with low seeding time
    if (minSeedingTimeHours) {
        const minSeedingTimeMS = minSeedingTimeHours * 60 * 60 * 1000
        for (let i = 0; i < uniqueRemovalList.length; i++) {
            const torrent = uniqueRemovalList[i]
            if (torrent.seedingTime < minSeedingTimeMS) {
                log.info(`Prevented removing of "${setStringLength(torrent.name, 60)}" - low seeding time: ${Math.floor(torrent.seedingTime / 1000 / 60 / 60)}/${minSeedingTimeHours}h`)
                uniqueRemovalList.splice(i--, 1)
            }
        }
    }

    if (uniqueRemovalList.length > 0) {
        log.info('Torrents to remove:')
        console.table(uniqueRemovalList.map(t => ({
            'Name': setStringLength(t.name, 65),
            'Drive': path.parse(t.path).root,
            'Size': bytesToGB(t.size).toFixed(2) + ' GB',
            'Ratio': t.ratio / 1000,
            'Seeding time': msToDHMS(t.seedingTime),
            'Reason': t.removeReason
        })))
        
        // Prevent removing torrents according to settings
        if (!preventRemoving) {
            const uniqueRemovalHashList = uniqueRemovalList.map((item) => item.hash)
            await client.deleteTorrents(uniqueRemovalHashList)
        }
    }
}

const autoRemoveIteration = (...args) => iteration(autoRemove, intervalSeconds * 1000, ...args)

module.exports.start = () => Promise.all(clients.map(autoRemoveIteration))