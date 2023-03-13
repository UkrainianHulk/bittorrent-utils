import fs from 'node:fs/promises'
import path from 'node:path'
import { URL } from 'node:url'

class Torrent {
  constructor(data) {
    this.hash = data[0]
    this.status = data[1]
    this.name = data[2]
    this.size = data[3]
    this.percentProgress = data[4]
    this.downloaded = data[5]
    this.uploaded = data[6]
    this.ratio = data[7]
    this.uploadSpeed = data[8]
    this.downloadSpeed = data[9]
    this.eta = data[10]
    this.label = data[11]
    this.peersConnected = data[12]
    this.peersInSwarm = data[13]
    this.seedsConnected = data[14]
    this.seedsInSwarm = data[15]
    this.availability = data[16]
    this.torrentOrder = data[17]
    this.remaining = data[18]
    this.added = data[23]
    this.completed = data[24]
    this.path = data[26]
  }
}

class Peer {
  constructor(data) {
    this.region = data[0]
    this.ip = data[1]
    this.resolvedIp = data[2]
    this.client = data[5]
    this.flags = data[6]
    this.downloadSpeed = data[8]
    this.uploadSpeed = data[9]
    this.uploaded = data[13]
  }
}

class BitTorrent {
  #guid
  #guiPassword
  #guiUrl
  #guiUsername
  #ipFilterFilePath
  #token

  constructor({ guiUrl, guiUsername, guiPassword, installationPath }) {
    this.#guiUrl = guiUrl
    this.#guiUsername = guiUsername
    this.#guiPassword = guiPassword
    this.#ipFilterFilePath = path.join(installationPath, 'ipfilter.dat')
  }

  async #authorize() {
    if (this.#token && this.#guid) return
    const url = new URL('token.html', this.#guiUrl)
    const authString = 'Basic ' + Buffer.from(this.#guiUsername + ':' + this.#guiPassword).toString('base64')
    const response = await fetch(url.href, {
      headers: { Authorization: authString }
    })
    if (response.status !== 200) throw new Error(response.statusText)
    const responseBody = await response.text()
    this.#token = responseBody.match(/(?<=>)\S+?(?=<)/)[0]
    this.#guid = response.headers.get('set-cookie').match(/(?<=GUID=)\S+?(?=\b)/)[0]
  }

  async #authorizedRequest(url) {
    await this.#authorize()
    url.searchParams.set('token', this.#token)
    const authString = 'Basic ' + Buffer.from(this.#guiUsername + ':' + this.#guiPassword).toString('base64')
    const response = await fetch(url.href, {
      headers: {
        Authorization: authString,
        Cookie: `GUID=${this.#guid}`
      }
    })
    if (response.status !== 200) {
      this.resetAuth()
      const responseText = (await response.text()).replace(/^\s+|\s+$/g, '')
      throw new Error(`${response.status} ${response.statusText}: ${responseText}`)
    }
    return response.json()
  }

  resetAuth() {
    this.#token = null
    this.#guid = null
  }

  async getTorrents() {
    const url = new URL(this.#guiUrl)
    url.searchParams.set('list', 1)
    const list = await this.#authorizedRequest(url)
    return list.torrents.map((item) => new Torrent(item))
  }

  async getPeers(hashes) {
    if (!Array.isArray(hashes)) hashes = [hashes]
    if (!hashes.length) return []
    const url = new URL(this.#guiUrl)
    url.searchParams.set('action', 'getpeers')
    for (const hash of hashes) url.searchParams.append('hash', hash)
    const data = await this.#authorizedRequest(url)
    const peers = data?.peers?.reduce((acc, item, index, list) => {
      if (typeof item === 'string') {
        const peers = list[index + 1].map((peer) => new Peer(peer))
        peers.forEach((peer) => (peer.torrentHash = item))
        acc.push(...peers)
      }
      return acc
    }, [])
    return peers
  }

  async stopTorrents(hashes) {
    if (!Array.isArray(hashes)) hashes = [hashes]
    const url = new URL(this.#guiUrl)
    url.searchParams.set('action', 'stop')
    for (const hash of hashes) url.searchParams.append('hash', hash)
    return await this.#authorizedRequest(url)
  }

  async deleteTorrents(hashes, deleteFiles = true) {
    if (!Array.isArray(hashes)) hashes = [hashes]
    const url = new URL(this.#guiUrl)
    if (deleteFiles) url.searchParams.set('action', 'removedata')
    else url.searchParams.set('action', 'remove')
    for (const hash of hashes) url.searchParams.append('hash', hash)
    return await this.#authorizedRequest(url)
  }

  async getSettings() {
    const url = new URL(this.#guiUrl)
    url.searchParams.set('action', 'getsettings')
    const data = await this.#authorizedRequest(url)
    const settigns = data.settings.reduce((acc, item) => {
      acc[item[0]] = item[2]
      return acc
    }, {})
    return settigns
  }

  async setSettings(settings) {
    const url = new URL(this.#guiUrl)
    url.searchParams.set('action', 'setsetting')
    for (const option in settings) {
      url.searchParams.append('s', option)
      url.searchParams.append('v', settings[option])
    }
    return await this.#authorizedRequest(url)
  }

  async addUrl(link) {
    const url = new URL(this.#guiUrl)
    url.searchParams.set('action', 'add-url')
    url.searchParams.append('s', link)
    return await this.#authorizedRequest(url)
  }

  async reloadIpFilter() {
    await this.setSettings({ 'ipfilter.enable': false })
    await this.setSettings({ 'ipfilter.enable': true })
  }

  async addToIpsFilter(ips) {
    if (!Array.isArray(ips)) ips = [ips]
    await fs.appendFile(this.#ipFilterFilePath, ips.join('\n') + '\n')
  }

  async resetIpFilter() {
    await fs.writeFile(this.#ipFilterFilePath, '')
  }

  async healthCheck() {
    const url = new URL(this.#guiUrl)
    return await fetch(url.href)
  }
}

export default BitTorrent
