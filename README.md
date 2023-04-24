# BitTorrent Utilities

Convenient and safe assistant for BTTС farming </br>
Community - [Telegram](https://t.me/bittorrent_utils)

## Quick overview

### Features

- **Transfering IN-APP BTTC**: transfer IN-APP BTTС between wallets
- **Transfering IN-APP BTTC automatically**: collect IN-APP BTTC automatically from your wallet to avoid losing them while downloading
- **Removing unnecessary torrents**: space-dependent and/or amount-dependent automatic removal of torrents
- **Peers filtering**: exclude peers that use no-BTTС clients
- **Configurating BitTorrent & μTorrent**: fast configure µTorrent/BitTorrent clients with optimal settings
- **Health checking and restart**: automatically restart µTorrent/BitTorrent client if it crashes
- **Cross-platform**: windows and linux compatible
- **Private**: local transactions signing, all private actions take place only on your pc

### Сonsole output sample

![Script console output sample](screenshots/0.png?raw=true)

## Quick start

### Windows

- Install [Node.js](https://nodejs.org/en/) if not installed already. Recommended version is [v19.7.0](https://nodejs.org/download/release/v19.7.0/)

- [Download](https://github.com/UkrainianHulk/bittorrent-utils/archive/refs/heads/main.zip) and unzip this repository or use git clone:

  ```bash
  git clone https://github.com/UkrainianHulk/bittorrent-utils
  ```

- Edit `bittorrent-utils/config/user.js`

- Run `bittorrent-utils/START.bat`

### Linux

- Install Node.js and Git if not installed already:

  ```bash
  apt update && apt install nodejs git
  ```

- Clone this repository:

  ```bash
  git clone https://github.com/UkrainianHulk/bittorrent-utils
  ```

- Edit configuration file:

  ```bash
  nano bittorrent-utils/config/user.js
  ```

- Navigate to script directory and start it:

  ```bash
  cd bittorrent-utils && npm start
  ```

## Setup

This script is designed as one instance per BitTorrent/uTorrent client.

### Settings

The script provides two config files:

1. User config file location: `bittorrent-utils/config/user.js`
   - the settings from this file overwrite the default settings from the `default.js` file
   - **edit `user.js`** file to configure your instance of script
2. Default config file location: `bittorrent-utils/config/default.js`
   - a file with the default settings, you can find here all possible options
   - **avoid editing `default.js`** file in favor of editing `user.js` file

## FAQ

- > **Q: How to send desired amount of in-app BTTC to others?** \
  > **A:** Run `bittorrent-utils/MANUAL_TRANSFER.bat` and follow the instructions
- > **Q: Where can i find bittorrent speed port?** \
  > **A:** Navigate folder `C:\Users\[USER]\AppData\Local\BitTorrentHelper\port` or in browser URL bar BitTorrent Speed web interface is opened: \
  > ![BitTorrent Speed URL in browser URL bar](screenshots/10.png?raw=true)
- > **Q: How to get access token?** \
  > **A:** Navigate in the browser <http://127.0.0.1:[BITTORRENT_SPEED_PORT]/api/token>

- > **Q: How to get public key (speed address)?** \
  > **A:** Navigate in the browser <http://127.0.0.1:[BITTORRENT_SPEED_PORT]/api/public_key?t=[TOKEN]>

- > **Q: My speed wallet shows wrong balance!** \
  > **A:** Navigate in the browser <http://127.0.0.1:[BITTORRENT_SPEED_PORT]/api/refresh_balance>

## Useful links

- TRON fees calculator: <https://tronstation.io/calculator>

## Support

- You can ask for help or discuss the application in our community group in [Telegram](https://t.me/bittorrent_utils)
- If you found a bug, please open a [new issue](https://github.com/UkrainianHulk/bittorrent-utils/issues/new)

## Donations

- BTTC/TRX/USDT (TRX20) TTijwYsndktUJbCHuW5oNPBWoWrJ5RV1iW
- BTTC (in-app) BHGaoDov6gsuHbfk2Tc0cAyHABw3hoKS2Cv1uBpA+/nVc1JikV6IxqEZ/5NlizPGFpvMtONMyBeJcXOIb4Jdnjk=

## [License](https://github.com/UkrainianHulk/bittorrent-utils/blob/main/LICENSE)

Copyright © 2021 - 2023 Yaroslav Sorochan
