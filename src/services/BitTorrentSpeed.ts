import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

class BitTorrentSpeed {
  #password: string;
  #passwordForced: boolean;
  #port: number | undefined;
  #portFilePath: string;
  #privateKey: string | undefined;
  #token: string | undefined;
  #url: string | undefined;

  constructor({
    password,
    passwordForced,
    installationPath,
  }: {
    password: string;
    passwordForced: boolean;
    installationPath: string;
  }) {
    this.#password = password;
    this.#passwordForced = passwordForced;
    this.#portFilePath = path.join(installationPath, 'port');
  }

  async #readPort(): Promise<number> {
    if (this.#port !== undefined) return this.#port;
    const portFiledata = await readFile(this.#portFilePath);
    this.#port = parseInt(portFiledata.toString());
    return this.#port;
  }

  async #getUrl(): Promise<string> {
    if (this.#url !== undefined) return this.#url;
    const port = await this.#readPort();
    this.#url = `http://127.0.0.1:${port}/api/`;
    return this.#url;
  }

  async #authorize(): Promise<string> {
    if (this.#token !== undefined) return this.#token;
    const url = new URL('token', await this.#getUrl());
    const response = await fetch(url.href);
    if (response.status !== 200) throw new Error(`${response.statusText} (${url.href})`);
    this.#token = await response.text();
    return this.#token;
  }

  async #authorizedRequest(url: URL, options?: RequestInit): Promise<string> {
    const token = await this.#authorize();
    url.searchParams.set('t', token);
    const response = await fetch(url.href, options);
    if (response.status === 403) this.resetAuth();
    if (response.status !== 200) {
      const responseText = (await response.text()).replace(/^\s+|\s+$/g, '');
      throw new Error(
        `${response.status} ${response.statusText}: ${responseText} (${url.href})`
      );
    }
    return await response.text();
  }

  resetAuth(): void {
    this.#token = undefined;
    this.#port = undefined;
    this.#url = undefined;
  }

  async resetPassword(newPassword: string): Promise<string | undefined> {
    if (!this.#passwordForced) return;
    const url = new URL('password', await this.#getUrl());
    await this.#authorizedRequest(url, {
      method: 'POST',
      body: Buffer.from(newPassword),
    });
    this.#password = newPassword;
    return this.#password;
  }

  async getPrivateKey(): Promise<string> {
    await this.resetPassword(this.#password);
    const url = new URL('private_key', await this.#getUrl());
    url.searchParams.set('pw', this.#password);
    this.#privateKey = await this.#authorizedRequest(url);
    return this.#privateKey;
  }

  async disableTokensSpending(): Promise<string> {
    const url = new URL('store/spend', await this.#getUrl());
    return await this.#authorizedRequest(url, {
      method: 'POST',
      body: Buffer.from('false'),
    });
  }

  async getStatus(): Promise<string> {
    const url = new URL('status', await this.#getUrl());
    return await this.#authorizedRequest(url);
  }
}

export default BitTorrentSpeed;
