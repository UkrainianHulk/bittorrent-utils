const path = require('path')
const config = require('config')
const BitTorrent = require('./libs/BitTorrent.js')
const {iteration} = require('./libs/utils.js')
const log = require('./libs/log.js')

const bytesToGB = (bytes) => bytes / 1024 / 1024 / 1024
const GBtoBytes = (gb) => gb * 1024 * 1024 * 1024

const getClient = async (credentials, clientIndex) => {
    try {
        const client = await new BitTorrent({
            guiUrl: credentials.GUI_URL,
            username: credentials.USERNAME,
            password: credentials.PASSWORD
        }).login()
        log.info(`Cleint #${clientIndex} logged in as ${credentials.USERNAME}`)
        client.quota = GBtoBytes(credentials.SIZE_QUOTA_PER_DRIVE_GB ? credentials.SIZE_QUOTA_PER_DRIVE_GB : config.get('AUTOREMOVE_SIZE_QUOTA_PER_DRIVE_GB'))
        return client
    } catch (error) { 
        log.error(`Cleint #${clientIndex}: ${error.message}`)
        return null
    }
}

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

const sortTorrents = (list) => list.map(item => {
    const started = !!(item.status % 2)
    
    if (!started) return {...item, coefficient: 0}

    const seedingDurationDays = (Date.now() / 1000 - item.added) / 60 / 60 / 24
    const uploadRatio = item.ratio / 1000
    const seedsRatio = item.seedsInSwarm / item.peersInSwarm
    const coefficient = (uploadRatio + 1) / (seedsRatio + 1) / Math.pow(seedingDurationDays + 1, 2)
    
    return {...item, started, seedingDurationDays, uploadRatio, seedsRatio, coefficient}
}).sort((a, b) => b.coefficient - a.coefficient)

const removeBySpace = async (list, client, clientIndex) => {
    const listsPerDrive = getListsPerDrive(list)
    const removalList = []

    for (let drive in listsPerDrive) {
        const listOnDrive = listsPerDrive[drive]
        const totalSize = listOnDrive.totalSize

        if (totalSize > client.quota) {
            const exccess = totalSize - client.quota
            const sortedList = sortTorrents(listOnDrive.torrents)
            const torrentsToRemove = []
            
            do {
                if (sortedList.length === 0) {
                    log.warn('Nothing to delete. But there is not enough space for the desired downloads')
                    break
                }
                const torrent = sortedList.pop()
                if (torrent.coefficient === 0) continue
                torrentsToRemove.push(torrent)
            } while (torrentsToRemove.reduce((acc, torrent) => acc += torrent.size, 0) < exccess)
            
            removalList.push(...torrentsToRemove)

            log.info(`Client #${clientIndex}, ${drive} - ${bytesToGB(totalSize).toFixed(2)}/${bytesToGB(client.quota).toFixed(2)}GB, exccess ${bytesToGB(exccess).toFixed(2)}GB`)
        } else {
            log.debug(`Client #${clientIndex}, drive ${drive} - ${bytesToGB(totalSize).toFixed(2)}/${bytesToGB(client.quota).toFixed(2)}GB`)
        }
    }

    return removalList
}

const removeByAmount = async (list, client, clientIndex) => {
    const maxAmount = config.get('AUTOREMOVE_TORRENTS_MAX_AMOUNT')
    const removalList = []

    if (list.length > maxAmount) {
        const exccess = list.length - maxAmount
        const sortedList = sortTorrents(list)
        log.info(`Client #${clientIndex}, torrents amount exccess - ${exccess}`)
        removalList.push(...sortedList.slice(maxAmount, list.length))
    }

    return removalList
}

const autoRemove = async (client, clientIndex) => {
    const list = await client.getList()
    const removalList = []

    if (config.get('AUTOREMOVE_TORRENTS_MAX_AMOUNT')) removalList.push(...(await removeByAmount(list, client, clientIndex)))
    if (config.get('AUTOREMOVE_SIZE_QUOTA_PER_DRIVE_GB')) removalList.push(...(await removeBySpace(list, client, clientIndex)))

    const uniqueRemovalHashList = [...new Set(removalList.map(item => item.hash))]
    const uniqueRemovalList = uniqueRemovalHashList.map(hash => removalList.find(item => item.hash === hash))

    console.table(uniqueRemovalList.map(t => ({
        name: t.name,
        // drive: drive,
        // size: bytesToGB(t.size).toFixed(2) + ' GB',
        // ratio: t.ratio / 1000,
        // seedsRatio: t.seedsRatio,
        coefficient: t.coefficient,
        // added: new Date(t.added * 1000).toLocaleString()
    })))

    if (!config.get('AUTOREMOVE_PREVENT_REMOVING')) await client.deleteTorrents(uniqueRemovalHashList)
}

const autoRemoveIteration = (...args) => iteration(autoRemove, config.get('AUTOREMOVE_INTERVAL_SECONDS') * 1000, ...args)

module.exports.start = async () => {
    const clients = await Promise.all(config.get('CLIENTS').map(getClient))
    await Promise.all(clients.filter(client => client !== null).map(autoRemoveIteration))
}