const path = require('path')
const config = require('config')
const { iteration } = require('./libs/utils.js')
const log = require('./libs/log.js')
const clients = require ('./clients.js')

const bytesToGB = (bytes) => bytes / 1024 / 1024 / 1024
const GBtoBytes = (GB) => GB * 1024 * 1024 * 1024

const getListsPerDrive = (list) => list.reduce((acc, torrent) => {
    const torrentRoot = path.parse(torrent.path).root
    if (!acc[torrentRoot]) {
        acc[torrentRoot] = {
            torrents: [torrent],
            totalSize: torrent.size
        }
    } else {
        acc[torrentRoot].torrents.push(torrent)
        acc[torrentRoot].totalSize += torrent.size
    }
    return acc
}, {})

const removeBySpace = (list, client) => {
    const quota = GBtoBytes(client.settings.SIZE_QUOTA_PER_DRIVE_GB ? client.settings.SIZE_QUOTA_PER_DRIVE_GB : config.get('AUTOREMOVE_SIZE_QUOTA_PER_DRIVE_GB'))
    const listsPerDrive = getListsPerDrive(list)
    const removalList = []

    for (let drive in listsPerDrive) {
        const listOnDrive = listsPerDrive[drive]
        const totalSize = listOnDrive.totalSize

        if (totalSize > quota) {
            const exccess = totalSize - quota
            const torrentsToRemove = []
            
            do {
                if (listOnDrive.torrents.length === 0) {
                    log.warn('Nothing to delete. But there is not enough space for the desired downloads')
                    break
                }
                const torrent = listOnDrive.torrents.pop()
                if (torrent.coefficient === 0) continue
                torrentsToRemove.push(torrent)
            } while (torrentsToRemove.reduce((acc, torrent) => acc += torrent.size, 0) < exccess)
            
            removalList.push(...torrentsToRemove)

            log.info(`Client #${client.index}, ${drive} - ${bytesToGB(totalSize).toFixed(2)}/${bytesToGB(quota).toFixed(2)}GB, exccess ${bytesToGB(exccess).toFixed(2)}GB`)
        } else {
            log.debug(`Client #${client.index}, torrents size at drive ${drive} - ${bytesToGB(totalSize).toFixed(2)}GB of ${bytesToGB(quota).toFixed(2)}GB`)
        }
    }

    return removalList
}

const removeByAmount = (list, client) => {
    const maxAmount = config.get('AUTOREMOVE_TORRENTS_MAX_AMOUNT')
    const removalList = []

    if (list.length > maxAmount) {
        const exccess = list.length - maxAmount
        log.info(`Client #${client.index}: torrents amount - ${list.length} of ${maxAmount}, exccess = ${exccess}`)
        removalList.push(...list.slice(maxAmount, list.length))
    } else {
        log.debug(`Client #${client.index}: torrents amount - ${list.length} of ${maxAmount}`)
    }

    return removalList
}

const autoRemove = async (client) => {
    const list = await client.getList()
    const sortedList = list.sort((a, b) => b.added - a.added)
    const dedupeList = []
    const removalList = []

    for (let i = sortedList.length - 1; i >= 0; i--) {
        const listItem = sortedList[i]
        if (sortedList.slice(0, i).find(item => item.path === listItem.path)) {
            dedupeList.push(sortedList.splice(i, 1)[0])
            i--
        }
    }

    if (dedupeList.length > 0) {
        const dedupeHashList = dedupeList.map(item => item.hash)

        log.info('Dedupe:')

        console.table(dedupeHashList.map(t => ({
            name: t.name,
            drive: path.parse(t.path).root,
            size: bytesToGB(t.size).toFixed(2) + ' GB',
            ratio: t.ratio / 1000,
            added: new Date(t.added * 1000).toLocaleString()
        })))

        if (!config.get('AUTOREMOVE_PREVENT_REMOVING')) await client.deleteTorrents(dedupeHashList, false)
    }

    if (config.get('AUTOREMOVE_TORRENTS_MAX_AMOUNT')) removeByAmount(sortedList, client).forEach(item => removalList.push(item))
    if (config.get('AUTOREMOVE_SIZE_QUOTA_PER_DRIVE_GB')) removeBySpace(sortedList, client).forEach(item => removalList.push(item))

    if (removalList.length > 0) {
        const uniqueRemovalHashList = [...new Set(removalList.map(item => item.hash))]
        const uniqueRemovalList = uniqueRemovalHashList.map(hash => removalList.find(item => item.hash === hash))
    
        console.table(uniqueRemovalList.map(t => ({
            name: t.name,
            drive: path.parse(t.path).root,
            size: bytesToGB(t.size).toFixed(2) + ' GB',
            ratio: t.ratio / 1000,
            added: new Date(t.added * 1000).toLocaleString()
        })))
    
        if (!config.get('AUTOREMOVE_PREVENT_REMOVING')) await client.deleteTorrents(uniqueRemovalHashList)
    }
}

const autoRemoveIteration = (...args) => iteration(autoRemove, config.get('AUTOREMOVE_INTERVAL_SECONDS') * 1000, ...args)

module.exports.start = () => Promise.all(clients.map(autoRemoveIteration))