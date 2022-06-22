const fs = require('fs')
const path = require('path')
const process = require('process')
const config = require('config')
const semver = require('semver')
const { iteration } = require('./libs/utils.js')
const log = require('./libs/log.js')
const client = require('./client.js')

const ipfilterFilePathSetting = config.get('PEERS_FILTER_IPFILTER_FILE_PATH')

let filterListLastResetTime = null

const filterPeers = async (client) => {
    const ipfilterFilePath =
        ipfilterFilePathSetting === 'auto'
            ? path.join(process.env.APPDATA, 'BitTorrent/ipfilter.dat')
            : ipfilterFilePathSetting

    fs.accessSync(path.dirname(ipfilterFilePath))

    const parseVersion = (clientName) => {
        const match = clientName.match(/\d+\.\d+\.\d+/)
        return match ? match[0] : null
    }

    const updateIpFilter = async () => {
        await client.bitTorrent.setSettings({ 'ipfilter.enable': false })
        await client.bitTorrent.setSettings({ 'ipfilter.enable': true })
    }

    const resetFilterList = async () => {
        try {
            fs.accessSync(ipfilterFilePath)
            fs.writeFileSync(ipfilterFilePath, '')
            filterListLastResetTime = Date.now()
            await updateIpFilter()
            log.info(`Ip filter has been reset`)
        } catch (error) {
            if (error.code === 'ENOENT') {
                log.debug(
                    `ipfilter.dat does not exist, skipping ip filter reset...`
                )
            } else {
                throw error
            }
        }
    }

    if (filterListLastResetTime === null) await resetFilterList()
    else if (
        Date.now() - filterListLastResetTime >
        config.get('PEERS_FILTER_RESET_INTERVAL_MINUTES') * 60 * 1000
    )
        await resetFilterList()

    const torrentList = await client.bitTorrent.getList()
    const peerList = await client.bitTorrent.getPeers(
        torrentList.map((torrent) => torrent.hash)
    )

    const peersToBan = peerList.reduce((acc, peer) => {
        const version = parseVersion(peer.client)
        const torrentStatus = torrentList.find(
            (torrent) => torrent.hash === peer.torrentHash
        ).status

        // if torrent status is 'downloading' so dont ban peer that upload to you more then download
        if (torrentStatus === 201 && peer.uploadSpeed < peer.downloadSpeed)
            return acc
        else if (
            peer.client.startsWith('μTorrent') &&
            semver.satisfies(
                version,
                config.get('PEERS_FILTER_UTORRENT_VERSION')
            )
        )
            return acc
        else if (
            peer.client.startsWith('BitTorrent') &&
            semver.satisfies(
                version,
                config.get('PEERS_FILTER_BITTORRENT_VERSION')
            )
        )
            return acc
        else if (
            peer.client.startsWith('libtorrent') &&
            semver.satisfies(
                version,
                config.get('PEERS_FILTER_LIBTORRENT_VERSION')
            )
        )
            return acc
        else return [...acc, peer]
    }, [])

    if (peersToBan.length) {
        try {
            fs.accessSync(ipfilterFilePath)
        } catch (error) {
            if (error.code === 'ENOENT') {
                log.debug(`ipfilter.dat does not exist, creating new one...`)
                fs.writeFileSync(ipfilterFilePath, '')
            } else throw error
        }

        fs.appendFileSync(
            ipfilterFilePath,
            peersToBan.map((peer) => peer.ip).join('\n') + '\n'
        )
        await updateIpFilter()

        const bannedIpsAmount = fs
            .readFileSync(ipfilterFilePath, 'utf-8')
            .split('\n')
            .filter((ip) => ip !== '').length
        log.info(
            `${
                peerList.length
            } peer(s), ${peersToBan.length.toLocaleString()} new ban(s) (${bannedIpsAmount.toLocaleString()} total): ${peersToBan
                .map((peer) => peer.client)
                .join(', ')}`
        )
    } else {
        log.debug(`No peers to ban`)
    }
}

const filterPeersIteration = (...args) =>
    iteration(
        filterPeers,
        config.get('PEERS_FILTER_INTERVAL_SECONDS') * 1000,
        ...args
    )

module.exports.start = () => filterPeersIteration(client)
