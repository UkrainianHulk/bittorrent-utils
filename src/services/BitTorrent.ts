import fs from 'node:fs/promises';
import path from 'node:path';
import { URL } from 'node:url';

type TorrentData = [          // EXAMPLE
  hash: string,               // "0F91285A9005839172BB2CC8D8603FF2F0A66201"
  statusCode: number,         // 201
  name: string,               // "TheBattleofShakerHeights(2003)WEB-DLRip.avi"
  size: number,               // 1281116160
  percentProgress: number,    // 1000
  downloaded: number,         // 1281116160
  uploaded: number,           // 1310033920
  ratio: number,              // 1022
  uploadSpeed: number,        // 0
  downloadSpeed: number,      // 0
  eta: number,                // -1
  label: string,              // ""
  peersConnected: number,     // 0
  peersInSwarm: number,       // 5
  seedsConnected: number,     // 0
  seedsInSwarm: number,       // 4
  availability: number,       // 65536
  torrentOrder: number,       // -1
  remaining: number,          // 0
  _unknown_: string,          // ""
  _unknown_: string,          // ""
  statusText: string,         // "Seeding 100.0 %"
  _unknown_: string,          // "b76bf4d0"
  addedTimestamp: number,     // 1679643603
  completedTimestamp: number, // 1679643887
  _unknown_: string,          // ""
  path: string,               // "C:\\Users\\Administrator\\Downloads"
  _unknown_: number,          // 0
  _unknown_: string           // "1B1A1730"
];

type PeerData = [             // EXAMPLE
  region: string,             // "00"
  ip: string,                 // "46.211.95.161"
  resolvedIp: string,         // "46-211-95-161.mobile.kyivstar.net"
  _unknown_: number,          // 1
  _unknown_: number,          // 43565
  clientName: string,         // "μTorrent 3.6"
  flags: string,              // "U IHP"
  _unknown_: number,          // 731
  downloadSpeed: number,      // 1538
  uploadSpeed: number,        // 571150
  _unknown_: number,          // 0
  _unknown_: number,          // 0
  _unknown_: number,          // 1679644984
  uploaded: number,           // 424396800
  _unknown_: number,          // 0
  _unknown_: number,          // 0
  _unknown_: number,          // 1091959
  _unknown_: number,          // 848581
  _unknown_: number,          // 4126
  _unknown_: number,          // 961020
  _unknown_: number,          // 0
  _unknown_: number,          // 0
]

interface TorrentsResponseData {
  torrents?: TorrentData[]
}

interface PeersResponseData {
  peers?: Array<[torrentHash: string, peerData: PeerData[]]>
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makeTorrent = (data: TorrentData) => ({
  hash: data[0],
  status: data[1],
  name: data[2],
  size: data[3],
  percentProgress: data[4],
  downloaded: data[5],
  uploaded: data[6],
  ratio: data[7],
  uploadSpeed: data[8],
  downloadSpeed: data[9],
  eta: data[10],
  label: data[11],
  peersConnected: data[12],
  peersInSwarm: data[13],
  seedsConnected: data[14],
  seedsInSwarm: data[15],
  availability: data[16],
  torrentOrder: data[17],
  remaining: data[18],
  added: data[23],
  completed: data[24],
  path: data[26],
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const makePeer = (data: PeerData) => ({
  region: data[0],
  ip: data[1],
  resolvedIp: data[2],
  client: data[5],
  flags: data[6],
  downloadSpeed: data[8],
  uploadSpeed: data[9],
  uploaded: data[13],
});

class BitTorrent {
  #guiPassword: string;
  #guiUrl: string;
  #guiUsername: string;
  #ipFilterFilePath: string;
  #token: string | undefined;
  #guid: string | undefined;

  constructor({
    guiUrl,
    guiUsername,
    guiPassword,
    installationPath,
  }: {
    guiUrl: string;
    guiUsername: string;
    guiPassword: string;
    installationPath: string;
  }) {
    this.#guiUrl = guiUrl;
    this.#guiUsername = guiUsername;
    this.#guiPassword = guiPassword;
    this.#ipFilterFilePath = path.join(installationPath, 'ipfilter.dat');
  }

  get #authHeader(): string {
    const cred = Buffer.from(this.#guiUsername + ':' + this.#guiPassword);
    const authString = 'Basic ' + cred.toString('base64');
    return authString;
  }

  async #authorize(): Promise<{ token: string; guid: string }> {
    if (this.#token !== undefined && this.#guid !== undefined)
      return {
        token: this.#token,
        guid: this.#guid,
      };

    const url = new URL('token.html', this.#guiUrl);

    const response = await fetch(url.href, {
      headers: { Authorization: this.#authHeader },
    });
    const responseText = (await response.text()).replace(/^\s+|\s+$/g, '');
    if (response.status !== 200)
      throw new Error(
        `${response.status} ${response.statusText}: ${responseText}`
      );

    const responseBody = await response.text();
    const token = responseBody.match(/(?<=>)\S+?(?=<)/)?.[0];
    const guid = response.headers
      .get('set-cookie')
      ?.match(/(?<=GUID=)\S+?(?=\b)/)?.[0];
    if (token === undefined || guid === undefined)
      throw new Error('Failed to obtain credentials');

    this.#token = token;
    this.#guid = guid;

    return { token, guid };
  }

  resetAuth(): void {
    this.#token = undefined;
    this.#guid = undefined;
  }

  async #authorizedRequest(url: URL): Promise<any> {
    const { token, guid } = await this.#authorize();
    url.searchParams.set('token', token);
    const response = await fetch(url.href, {
      headers: {
        Authorization: this.#authHeader,
        Cookie: `GUID=${guid}`,
      },
    });
    if (response.status !== 200) {
      this.resetAuth();
      const responseText = (await response.text()).replace(/^\s+|\s+$/g, '');
      throw new Error(
        `${response.status} ${response.statusText}: ${responseText}`
      );
    }
    return await response.json();
  }

  async getTorrents(): Promise<Array<ReturnType<typeof makeTorrent>>> {
    const url = new URL(this.#guiUrl);
    url.searchParams.set('list', '1');
    const data: TorrentsResponseData = await this.#authorizedRequest(url);
    if (data.torrents === undefined) return [];
    return data.torrents.map(makeTorrent);
  }

  async getPeers(
    hashes: string | string[]
  ): Promise<Array<ReturnType<typeof makePeer>>> {
    if (!Array.isArray(hashes)) hashes = [hashes];
    if (hashes.length === 0) return [];

    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'getpeers');
    for (const hash of hashes) url.searchParams.append('hash', hash);
    const data: PeersResponseData = await this.#authorizedRequest(url);

    // const peers = data.peers.reduce((acc, item, index, list) => {
    //   if (typeof item === 'string') {
    //     const peers = list[index + 1].map((peer) => makePeer(peer));
    //     peers.forEach((peer) => (peer.torrentHash = item));
    //     acc.push(...peers);
    //   }
    //   return acc;
    // }, []);

    const peers = data.peers
      .filter((peer: unknown) => typeof peer === 'string')
      .flatMap((item: string, index: number, list: string[]) => {
        const peers = list[index + 1].map((peer) => makePeer(peer));
        for (const peer in peers) peer.torrentHash = item;
        return peers;
      });

    return peers;
  }

  async stopTorrents(hashes) {
    if (!Array.isArray(hashes)) hashes = [hashes];
    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'stop');
    for (const hash of hashes) url.searchParams.append('hash', hash);
    return await this.#authorizedRequest(url);
  }

  async deleteTorrents(hashes, deleteFiles = true) {
    if (!Array.isArray(hashes)) hashes = [hashes];
    const url = new URL(this.#guiUrl);
    if (deleteFiles) url.searchParams.set('action', 'removedata');
    else url.searchParams.set('action', 'remove');
    for (const hash of hashes) url.searchParams.append('hash', hash);
    return await this.#authorizedRequest(url);
  }

  async getSettings() {
    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'getsettings');
    const data = await this.#authorizedRequest(url);
    const settigns = data.settings.reduce((acc, item) => {
      acc[item[0]] = item[2];
      return acc;
    }, {});
    return settigns;
  }

  async setSettings(settings) {
    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'setsetting');
    for (const option in settings) {
      url.searchParams.append('s', option);
      url.searchParams.append('v', settings[option]);
    }
    return await this.#authorizedRequest(url);
  }

  async addUrl(link) {
    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'add-url');
    url.searchParams.append('s', link);
    return await this.#authorizedRequest(url);
  }

  async reloadIpFilter() {
    await this.setSettings({ 'ipfilter.enable': false });
    await this.setSettings({ 'ipfilter.enable': true });
  }

  async addToIpsFilter(ips) {
    if (!Array.isArray(ips)) ips = [ips];
    await fs.appendFile(this.#ipFilterFilePath, ips.join('\n') + '\n');
  }

  async resetIpFilter() {
    await fs.writeFile(this.#ipFilterFilePath, '');
  }

  async healthCheck() {
    const url = new URL(this.#guiUrl);
    return await fetch(url.href);
  }
}

export default BitTorrent;
