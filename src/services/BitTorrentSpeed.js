import { readFile } from 'fs/promises'
import { URL } from 'url'
import fetch from 'node-fetch'

class BitTorrentSpeed {
    #url
    #token
    #password
    #passwordForced
    #portFilePath
    #port
    #privateKey

    constructor({ password, passwordForced, portFilePath }) {
        this.#password = password
        this.#passwordForced = passwordForced
        this.#portFilePath = portFilePath
    }

    async #readPort() {
        if (this.#port) return this.#port
        const portFiledata = await readFile(this.#portFilePath)
        this.#port = parseInt(portFiledata)
        return this.#port
    }

    async #getUrl() {
        if (this.#url) return this.#url
        await this.#readPort()
        this.#url = `http://127.0.0.1:${this.#port}/api/`
        return this.#url
    }

    async #authorize() {
        if (this.#token) return this.#token
        const url = new URL('token', await this.#getUrl())
        const response = await fetch(url.href)
        if (response.status !== 200) throw new Error(response.statusText)
        this.#token = await response.text()
        return this.#token
    }

    async #authorizedRequest(url, options) {
        await this.#authorize()
        url.searchParams.set('t', this.#token)
        const response = await fetch(url.href, options)
        if (response.status === 403) this.resetAuth()
        if (response.status !== 200) {
            const responseText = (await response.text()).replace(
                /^\s+|\s+$/g,
                ''
            )
            throw new Error(
                `${response.status} ${response.statusText}: ${responseText}`
            )
        }
        return response.text()
    }

    resetAuth() {
        this.#token = null
    }

    async resetPassword(newPassword) {
        if (!this.#passwordForced) return
        const url = new URL('password', await this.#getUrl())
        await this.#authorizedRequest(url, {
            method: 'POST',
            body: Buffer.from(newPassword),
        })
        this.#password = newPassword
        return this.#password
    }

    async getPrivateKey() {
        await this.resetPassword(this.#password)
        const url = new URL('private_key', await this.#getUrl())
        url.searchParams.set('pw', this.#password)
        this.#privateKey = await this.#authorizedRequest(url)
        return this.#privateKey
    }

    async disableTokensSpending() {
        const url = new URL('store/spend', await this.#getUrl())
        return await this.#authorizedRequest(url, {
            method: 'POST',
            body: Buffer.from('false'),
        })
    }
}

export default BitTorrentSpeed
