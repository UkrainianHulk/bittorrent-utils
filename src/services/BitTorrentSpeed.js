import fs from 'fs'
import { URL } from 'url'
import fetch from 'node-fetch'

export default class BitTorrentSpeed {
    constructor({ password, portFilePath }) {
        const portFileData = fs.readFileSync(portFilePath)
        const port = parseInt(portFileData)
        this.#url = `http://127.0.0.1:${port}/api/`
        this.#password = password
    }

    #url
    #token
    #password
    #privateKey

    async #authorize() {
        if (this.#token) return
        const url = new URL('token', this.#url)
        const response = await fetch(url.href)
        if (response.status !== 200) throw new Error(response.statusText)
        this.#token = await response.text()
    }

    async #authorizedRequest(url, options) {
        await this.#authorize()
        url.searchParams.set('t', this.#token)
        const response = await fetch(url.href, options)
        if (response.status !== 200) throw new Error(response.statusText)
        else return response.text()
    }

    async resetPassword(newPassword) {
        const url = new URL('password', this.#url)
        await this.#authorizedRequest(url, {
            method: 'POST',
            body: Buffer.from(newPassword),
        })
        this.#password = newPassword
        return this.#password
    }

    async getPrivateKey() {
        const url = new URL('private_key', this.#url)
        url.searchParams.set('pw', this.#password)
        this.#privateKey = await this.#authorizedRequest(url)
        return this.#privateKey
    }

    async disableTokensSpending() {
        const url = new URL('store/spend', this.#url)
        return await this.#authorizedRequest(url, {
            method: 'POST',
            body: Buffer.from('false'),
        })
    }
}
