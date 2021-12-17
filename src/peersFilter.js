const fs = require('fs')
const path = require('path')
const process = require('process')
const config = require('config')
const semver = require('semver')
const { iteration } = require('./libs/utils.js')
const log = require('./libs/log.js')
const clients = require ('./clients.js')

const filterPeers = async (client, clientIndex) => {
    const torrentList = await client.getList()
    const peerList = await client.getPeers(torrentList.map(torrent => torrent.hash))

    const parseVersion = (clientName) => {
        const match = clientName.match(/\d+\.\d+\.\d+/)
        return match ? match[0] : null
    }
    
    const peersToBan = peerList.reduce((acc, peer) => {
        const version = parseVersion(peer.client)
        const torrentStatus = torrentList.find(torrent => torrent.hash === peer.torrentHash).status

        // if torrent status is 'downloading' so dont ban peer that upload to you more then download
        if (torrentStatus === 201 && peer.uploadSpeed < peer.downloadSpeed) return acc
        else if (peer.client.startsWith('μTorrent') && semver.satisfies(version, config.get('PEERS_FILTER_UTORRENT_VERSION'))) return acc
        else if (peer.client.startsWith('BitTorrent') && semver.satisfies(version, config.get('PEERS_FILTER_BITTORRENT_VERSION'))) return acc
        else if (peer.client.startsWith('libtorrent') && semver.satisfies(version, config.get('PEERS_FILTER_LIBTORRENT_VERSION'))) return acc
        else return [...acc, peer]

    }, [])

    if (peersToBan.length) {
        const ipfilterFilePath = client.settings.IPFILTER_FILE_PATH === 'auto' ? path.join(process.env.APPDATA, "BitTorrent/ipfilter.dat") : client.settings.IPFILTER_FILE_PATH
        
        try {
            fs.accessSync(path.dirname(ipfilterFilePath))

            const bannedIps = (fs.readFileSync(ipfilterFilePath, 'utf-8')).split('\n').filter(ip => ip !== '')
            const newBannedIps = bannedIps.concat(peersToBan.map(peer => peer.ip))
            if (newBannedIps.length > config.get('PEERS_FILTER_BANLIST_MAX_LENGTH')) newBannedIps.splice(0, newBannedIps.length - config.get('PEERS_FILTER_BANLIST_MAX_LENGTH'))
            fs.writeFileSync(ipfilterFilePath, newBannedIps.join('\n'))
            
            await client.setSettings({'ipfilter.enable': false})
            await client.setSettings({'ipfilter.enable': true})
            
            log.info(`Client #${clientIndex}: ${peerList.length} peer(s), ${peersToBan.length.toLocaleString()} new ban(s) (${(newBannedIps.length).toLocaleString()}/${config.get('PEERS_FILTER_BANLIST_MAX_LENGTH')}): ${peersToBan.map(peer => peer.client).join(', ')}`)
        } catch (error) {
            if (error.code === 'ENOENT') {
                fs.writeFileSync(ipfilterFilePath, '')
                log.debug(`Client #${clientIndex}: ipfilter.dat file created`)
            }
            else throw error
        }
    } else {
        log.debug(`Client #${clientIndex}: no peers to ban`)
    }
}

const filterPeersIteration = (...args) => iteration(filterPeers, config.get('PEERS_FILTER_INTERVAL_SECONDS') * 1000, ...args)

module.exports.start = () => Promise.all(clients.map(filterPeersIteration))