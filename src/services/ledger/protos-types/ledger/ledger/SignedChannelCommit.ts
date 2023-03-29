// Original file: src/services/ledger/protos/ledger.proto

import type { ChannelCommit as _ledger_ChannelCommit, ChannelCommit__Output as _ledger_ChannelCommit__Output } from '../ledger/ChannelCommit';

export interface SignedChannelCommit {
  'channel'?: (_ledger_ChannelCommit | null);
  'signature'?: (Buffer | Uint8Array | string);
}

export interface SignedChannelCommit__Output {
  'channel': (_ledger_ChannelCommit__Output | null);
  'signature': (Buffer);
}
