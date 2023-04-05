import fs from 'node:fs/promises';
import path from 'node:path';
import { URL } from 'node:url';

export type TorrentData = [
  hash: string, // "0F91285A9005839172BB2CC8D8603FF2F0A66201"
  statusCode: number, // 201
  name: string, // "TheBattleofShakerHeights(2003)WEB-DLRip.avi"
  size: number, // 1281116160
  percentProgress: number, // 1000
  downloadedBytes: number, // 1281116160
  uploadedBytes: number, // 1310033920
  ratio: number, // 1022
  uploadSpeed: number, // 0
  downloadSpeed: number, // 0
  eta: number, // -1
  label: string, // ""
  peersConnected: number, // 0
  peersInSwarm: number, // 5
  seedsConnected: number, // 0
  seedsInSwarm: number, // 4
  availability: number, // 65536
  torrentOrder: number, // -1
  remaining: number, // 0
  _unknown_: string, // ""
  _unknown_: string, // ""
  statusText: string, // "Seeding 100.0 %"
  _unknown_: string, // "b76bf4d0"
  addedTimestamp: number, // 1679643603
  completedTimestamp: number, // 1679643887
  _unknown_: string, // ""
  path: string, // "C:\\Users\\Administrator\\Downloads"
  _unknown_: number, // 0
  _unknown_: string // "1B1A1730"
];

export interface Torrent {
  hash: string;
  statusCode: number;
  name: string;
  size: number;
  percentProgress: number;
  downloadedBytes: number;
  uploadedBytes: number;
  ratio: number;
  uploadSpeed: number;
  downloadSpeed: number;
  eta: number;
  label: string;
  peersConnected: number;
  peersInSwarm: number;
  seedsConnected: number;
  seedsInSwarm: number;
  availability: number;
  torrentOrder: number;
  remaining: number;
  statusText: string;
  addedTimestamp: number;
  completedTimestamp: number;
  path: string;
}

const makeTorrent = (data: TorrentData): Torrent => ({
  hash: data[0],
  statusCode: data[1],
  name: data[2],
  size: data[3],
  percentProgress: data[4],
  downloadedBytes: data[5],
  uploadedBytes: data[6],
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
  statusText: data[21],
  addedTimestamp: data[23],
  completedTimestamp: data[24],
  path: data[26],
});

export type PeerData = [
  region: string, // "00"
  ip: string, // "46.211.95.161"
  resolvedIp: string, // "46-211-95-161.mobile.kyivstar.net"
  _unknown_: number, // 1
  _unknown_: number, // 43565
  clientName: string, // "μTorrent 3.6"
  flags: string, // "U IHP"
  _unknown_: number, // 731
  downloadSpeed: number, // 1538
  uploadSpeed: number, // 571150
  _unknown_: number, // 0
  _unknown_: number, // 0
  _unknown_: number, // 1679644984
  uploadedBytes: number, // 424396800
  _unknown_: number, // 0
  _unknown_: number, // 0
  _unknown_: number, // 1091959
  _unknown_: number, // 848581
  _unknown_: number, // 4126
  _unknown_: number, // 961020
  _unknown_: number, // 0
  _unknown_: number // 0
];

export interface Peer {
  torrentHash: string;
  region: string;
  ip: string;
  resolvedIp: string;
  clientName: string;
  flags: string;
  downloadSpeed: number;
  uploadSpeed: number;
  uploadedBytes: number;
}

const makePeer = (data: PeerData, torrentHash: string): Peer => ({
  torrentHash,
  region: data[0],
  ip: data[1],
  resolvedIp: data[2],
  clientName: data[5],
  flags: data[6],
  downloadSpeed: data[8],
  uploadSpeed: data[9],
  uploadedBytes: data[13],
});

type OptionName =
  | 'install_modification_time'
  | 'install_revision'
  | 'gui.granular_priority'
  | 'gui.overhead_in_statusbar'
  | 'gui.show_av_icon'
  | 'gui.ulrate_menu'
  | 'gui.dlrate_menu'
  | 'gui.manual_ratemenu'
  | 'gui.auto_restart'
  | 'minified'
  | 'mainwndstatus'
  | 'mainwnd_split'
  | 'mainwnd_split_x'
  | 'playback_split_x'
  | 'show_general_tab'
  | 'show_tracker_tab'
  | 'show_playback_tab'
  | 'show_peers_tab'
  | 'show_pieces_tab'
  | 'show_files_tab'
  | 'show_speed_tab'
  | 'show_logger_tab'
  | 'show_related_tab'
  | 'notify_complete'
  | 'gui.color_progress_bars'
  | 'search_list'
  | 'search_list_sel'
  | 'is_search_filtering'
  | 'offers.cookies.customized_ads'
  | 'offers.left_rail_offer_enabled'
  | 'offers.sponsored_torrent_offer_enabled'
  | 'offers.featured_content_badge_enabled'
  | 'offers.featured_content_notifications_enabled'
  | 'offers.featured_content_rss_enabled'
  | 'offers.featured_content_rss_url'
  | 'offers.featured_content_rss_update_interval'
  | 'offers.featured_content_rss_randomize'
  | 'offers.404_dismiss'
  | 'offers.404_shown'
  | 'offers.404_icon'
  | 'offers.404_url'
  | 'offers.404_text'
  | 'offers.404_tb_img'
  | 'offers.404_tb_bgc'
  | 'offers.404_tb_badge_img'
  | 'offers.404_tb_badge_coords'
  | 'offers.404_node'
  | 'offers.404_code'
  | 'offers.days_to_show'
  | 'torrents_start_stopped'
  | 'confirm_when_deleting'
  | 'confirm_remove_tracker'
  | 'streaming.safety_factor'
  | 'streaming.failover_rate_factor'
  | 'streaming.failover_set_percentage'
  | 'settings_saved_systime'
  | 'confirm_exit'
  | 'confirm_exit_critical_seeder'
  | 'close_to_tray'
  | 'minimize_to_tray'
  | 'start_minimized'
  | 'tray_activate'
  | 'tray.show'
  | 'tray.single_click'
  | 'activate_on_file'
  | 'check_assoc_on_start'
  | 'bind_port'
  | 'tracker_ip'
  | 'dir_active_download_flag'
  | 'dir_torrent_files_flag'
  | 'dir_completed_download_flag'
  | 'dir_completed_torrents_flag'
  | 'dir_active_download'
  | 'dir_torrent_files'
  | 'dir_completed_download'
  | 'dir_completed_torrents'
  | 'dir_add_label'
  | 'max_dl_rate'
  | 'max_ul_rate'
  | 'max_ul_rate_seed'
  | 'max_ul_rate_seed_flag'
  | 'private_ip'
  | 'only_proxied_conns'
  | 'no_local_dns'
  | 'gui.report_problems'
  | 'gui.persistent_labels'
  | 'gui.compat_diropen'
  | 'gui.alternate_color'
  | 'gui.transparent_graph_legend'
  | 'sys.prevent_standby'
  | 'sys.enable_wine_hacks'
  | 'ul_slots_per_torrent'
  | 'conns_per_torrent'
  | 'conns_globally'
  | 'max_active_torrent'
  | 'max_active_downloads'
  | 'seed_prio_limitul'
  | 'seed_prio_limitul_flag'
  | 'seeds_prioritized'
  | 'seed_ratio'
  | 'seed_time'
  | 'seed_num'
  | 'resolve_peerips'
  | 'check_update'
  | 'mutable_cfu_interval'
  | 'check_update_beta'
  | 'anoninfo'
  | 'upnp'
  | 'use_udp_trackers'
  | 'upnp.external_tcp_port'
  | 'upnp.external_udp_port'
  | 'upnp.external_ip'
  | 'natpmp'
  | 'lsd'
  | 'disable_fw'
  | 'dw'
  | 'tu'
  | 'td'
  | 'fd'
  | 'k'
  | 'v'
  | 'asip'
  | 'asdlurl'
  | 'asdns'
  | 'ascon'
  | 'asdl'
  | 'assz'
  | 'sched_enable'
  | 'sched_ul_rate'
  | 'sched_interaction'
  | 'sched_dl_rate'
  | 'sched_table'
  | 'sched_dis_dht'
  | 'enable_scrape'
  | 'show_toolbar'
  | 'show_details'
  | 'show_status'
  | 'show_category'
  | 'show_tabicons'
  | 'rand_port_on_start'
  | 'prealloc_space'
  | 'language'
  | 'logger_mask'
  | 'autostart'
  | 'dht'
  | 'dht_per_torrent'
  | 'pex'
  | 'rate_limit_local_peers'
  | 'multi_day_transfer_limit_en'
  | 'multi_day_transfer_mode_ul'
  | 'multi_day_transfer_mode_dl'
  | 'multi_day_transfer_mode_uldl'
  | 'multi_day_transfer_limit_unit'
  | 'multi_day_transfer_limit_value'
  | 'multi_day_transfer_limit_span'
  | 'net.bind_ip'
  | 'net.outgoing_ip'
  | 'net.outgoing_port'
  | 'net.outgoing_max_port'
  | 'net.low_cpu'
  | 'net.calc_overhead'
  | 'net.calc_rss_overhead'
  | 'net.calc_tracker_overhead'
  | 'net.max_halfopen'
  | 'net.limit_excludeslocal'
  | 'net.upnp_tcp_only'
  | 'net.disable_incoming_ipv6'
  | 'net.ratelimit_utp'
  | 'net.friendly_name'
  | 'isp.bep22'
  | 'isp.primary_dns'
  | 'isp.secondary_dns'
  | 'isp.fqdn'
  | 'isp.peer_policy_enable'
  | 'isp.peer_policy_url'
  | 'isp.peer_policy_override'
  | 'dir_autoload_flag'
  | 'dir_autoload_delete'
  | 'dir_autoload'
  | 'ipfilter.enable'
  | 'dht.collect_feed'
  | 'dht.rate'
  | 'append_incomplete'
  | 'show_add_dialog'
  | 'always_show_add_dialog'
  | 'gui.log_date'
  | 'remove_torrent_files_with_private_data'
  | 'boss_key'
  | 'boss_key_salt'
  | 'use_boss_key_pw'
  | 'boss_key_pw'
  | 'encryption_mode'
  | 'encryption_allow_legacy'
  | 'enable_share'
  | 'rss.update_interval'
  | 'rss.smart_repack_filter'
  | 'rss.feed_as_default_label'
  | 'bt.save_resume_rate'
  | 'bt.magnetlink_check_existing_files'
  | 'gui.delete_to_trash'
  | 'gui.default_del_action'
  | 'gui.speed_in_title'
  | 'gui.limits_in_statusbar'
  | 'gui.graphic_progress'
  | 'gui.piecebar_progress'
  | 'gui.show_status_icon_in_dl_list'
  | 'gui.tall_category_list'
  | 'gui.wide_toolbar'
  | 'gui.find_pane'
  | 'gui.toolbar_labels'
  | 'gui.category_list_spaces'
  | 'streaming.preview_player'
  | 'streaming.playback_player'
  | 'avwindow'
  | 'stats.video1.time_watched'
  | 'stats.video2.time_watched'
  | 'stats.video3.time_watched'
  | 'stats.video1.finished'
  | 'stats.video2.finished'
  | 'stats.video3.finished'
  | 'stats.welcome_page_useful'
  | 'store_torr_infohash'
  | 'magnet.download_wait'
  | 'av_enabled'
  | 'av_auto_update'
  | 'av_last_update_date'
  | 'plus_player_installed'
  | 'move_if_defdir'
  | 'gui.combine_listview_status_done'
  | 'gui.update_rate'
  | 'client_uuid'
  | 'next_market_share_report'
  | 'queue.dont_count_slow_dl'
  | 'queue.dont_count_slow_ul'
  | 'queue.slow_dl_threshold'
  | 'queue.slow_ul_threshold'
  | 'queue.use_seed_peer_ratio'
  | 'queue.prio_no_seeds'
  | 'bt.tcp_rate_control'
  | 'gui.graph_tcp_rate_control'
  | 'gui.graph_overhead'
  | 'gui.graph_legend'
  | 'bt.ratelimit_tcp_only'
  | 'bt.prioritize_partial_pieces'
  | 'bt.transp_disposition'
  | 'net.utp_target_delay'
  | 'net.utp_packet_size_interval'
  | 'net.utp_receive_target_delay'
  | 'net.utp_initial_packet_size'
  | 'net.utp_dynamic_packet_size'
  | 'bt.enable_pulse'
  | 'bt.pulse_weight'
  | 'bt.compact_allocation'
  | 'bt.use_dns_tracker_prefs'
  | 'bt.connect_speed'
  | 'bt.determine_encoded_rate_for_streamables'
  | 'streaming.min_buffer_piece'
  | 'bt.allow_same_ip'
  | 'bt.use_similar_torrent_data'
  | 'bt.no_connect_to_services'
  | 'bt.no_connect_to_services_list'
  | 'bt.ban_threshold'
  | 'bt.use_ban_ratio'
  | 'bt.ban_ratio'
  | 'bt.use_rangeblock'
  | 'bt.graceful_shutdown'
  | 'bt.shutdown_tracker_timeout'
  | 'bt.shutdown_upnp_timeout'
  | 'peer.lazy_bitfield'
  | 'peer.resolve_country'
  | 'peer.disconnect_inactive'
  | 'peer.disconnect_inactive_interval'
  | 'diskio.flush_files'
  | 'proxy.proxy'
  | 'proxy.type'
  | 'proxy.port'
  | 'proxy.auth'
  | 'proxy.p2p'
  | 'proxy.resolve'
  | 'proxy.username'
  | 'proxy.password'
  | 'webui.enable'
  | 'webui.enable_guest'
  | 'webui.enable_listen'
  | 'webui.token_auth'
  | 'webui.token_auth_filter'
  | 'webui.username'
  | 'webui.password'
  | 'webui.uconnect_enable'
  | 'webui.uconnect_username'
  | 'webui.uconnect_password'
  | 'webui.uconnect_username_anonymous'
  | 'webui.uconnect_question_opted_out'
  | 'webui.uconnect_computername'
  | 'webui.allow_pairing'
  | 'webui.ssdp_uuid'
  | 'webui.guest'
  | 'webui.restrict'
  | 'webui.port'
  | 'webui.cookie'
  | 'webui.uconnect_toolbar_ever'
  | 'webui.uconnect_enable_ever'
  | 'webui.uconnect_connected_ever'
  | 'webui.uconnect_actions_count'
  | 'webui.uconnect_actions_list_count'
  | 'webui.uconnect_cred_status'
  | 'webui.update_message'
  | 'webui.proxy_auth'
  | 'webui.update_url'
  | 'webui.track'
  | 'webui.version'
  | 'diskio.sparse_files'
  | 'diskio.no_zero'
  | 'diskio.use_partfile'
  | 'diskio.smart_hash'
  | 'diskio.smart_sparse_hash'
  | 'diskio.coalesce_writes'
  | 'diskio.coalesce_write_size'
  | 'diskio.max_write_queue'
  | 'diskio.cache_reduce_minutes'
  | 'diskio.cache_stripe'
  | 'diskio.quick_hash'
  | 'diskio.mark_of_the_web'
  | 'diskio.minimize_kernel_caching'
  | 'diskio.all_writes_sync'
  | 'cache.override'
  | 'cache.override_size'
  | 'cache.reduce'
  | 'cache.write'
  | 'cache.writeout'
  | 'cache.writeout_age_max'
  | 'cache.writeout_headspace'
  | 'cache.writeimm'
  | 'cache.read'
  | 'cache.read_turnoff'
  | 'cache.read_prune'
  | 'cache.read_thrash';

type Settings = Record<OptionName, string>;

interface BuildResponseData {
  build: number;
}

interface TorrentsResponseData extends BuildResponseData {
  torrents?: TorrentData[];
}
interface PeersResponseData extends BuildResponseData {
  peers?: [torrentHash: string, peerData: PeerData[]];
}

interface SettingsResponseData extends BuildResponseData {
  settings: Array<
    [
      settingName: OptionName,
      valueCode: number,
      valueText: string,
      access: {
        access: 'Y' | 'R' | 'W';
      }
    ]
  >;
}

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

  async #authorizedRequest<ResponseType>(url: URL): Promise<ResponseType> {
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

  async getTorrents(): Promise<Torrent[]> {
    const url = new URL(this.#guiUrl);
    url.searchParams.set('list', '1');
    const data = await this.#authorizedRequest<TorrentsResponseData>(url);
    if (data.torrents === undefined) return [];
    return data.torrents.map(makeTorrent);
  }

  async getPeers(hashes: string | string[]): Promise<Peer[]> {
    if (!Array.isArray(hashes)) hashes = [hashes];
    if (hashes.length === 0) return [];

    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'getpeers');
    for (const hash of hashes) url.searchParams.append('hash', hash);
    const data = await this.#authorizedRequest<PeersResponseData>(url);
    if (data.peers === undefined) return [];

    const peers = data.peers.reduce<Peer[]>((acc, item, index, list) => {
      if (typeof item === 'string') return acc;
      const torrentHash = list[index - 1];
      if (typeof torrentHash !== 'string') return acc;
      const instances = item.map((p) => makePeer(p, torrentHash));
      return [...acc, ...instances];
    }, []);

    return peers;
  }

  async stopTorrents(hashes: string | string[]): Promise<BuildResponseData> {
    if (!Array.isArray(hashes)) hashes = [hashes];
    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'stop');
    for (const hash of hashes) url.searchParams.append('hash', hash);
    return await this.#authorizedRequest<BuildResponseData>(url);
  }

  async deleteTorrents(
    hashes: string | string[],
    deleteFiles = true
  ): Promise<BuildResponseData> {
    if (!Array.isArray(hashes)) hashes = [hashes];
    const url = new URL(this.#guiUrl);
    if (deleteFiles) url.searchParams.set('action', 'removedata');
    else url.searchParams.set('action', 'remove');
    for (const hash of hashes) url.searchParams.append('hash', hash);
    return await this.#authorizedRequest<BuildResponseData>(url);
  }

  async getSettings(): Promise<Settings> {
    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'getsettings');
    const data = await this.#authorizedRequest<SettingsResponseData>(url);
    const settingsEntries = data.settings.map((item) => [item[0], item[2]]);
    const settings: Settings = Object.fromEntries(settingsEntries);
    return settings;
  }

  async setSettings(settings: Partial<Settings>): Promise<BuildResponseData> {
    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'setsetting');
    Object.entries(settings).forEach(([option, value]) => {
      url.searchParams.append('s', option);
      url.searchParams.append('v', value);
    });
    return await this.#authorizedRequest<BuildResponseData>(url);
  }

  async addUrl(link: string): Promise<BuildResponseData> {
    const url = new URL(this.#guiUrl);
    url.searchParams.set('action', 'add-url');
    url.searchParams.append('s', link);
    return await this.#authorizedRequest<BuildResponseData>(url);
  }

  async reloadIpFilter(): Promise<void> {
    await this.setSettings({ 'ipfilter.enable': 'false' });
    await this.setSettings({ 'ipfilter.enable': 'true' });
  }

  async addToIpsFilter(ips: string | string[]): Promise<void> {
    if (!Array.isArray(ips)) ips = [ips];
    await fs.appendFile(this.#ipFilterFilePath, ips.join('\n') + '\n');
  }

  async resetIpFilter(): Promise<void> {
    await fs.writeFile(this.#ipFilterFilePath, '');
  }

  async healthCheck(): Promise<void> {
    const url = new URL(this.#guiUrl);
    await fetch(url.href);
  }
}

export default BitTorrent;
