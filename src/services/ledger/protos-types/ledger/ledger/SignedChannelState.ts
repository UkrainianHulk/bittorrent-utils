// Original file: src/services/ledger/protos/ledger.proto

import type { ChannelState as _ledger_ChannelState, ChannelState__Output as _ledger_ChannelState__Output } from '../ledger/ChannelState';

export interface SignedChannelState {
  'channel'?: (_ledger_ChannelState | null);
  'from_signature'?: (Buffer | Uint8Array | string);
  'to_signature'?: (Buffer | Uint8Array | string);
}

export interface SignedChannelState__Output {
  'channel': (_ledger_ChannelState__Output | null);
  'from_signature': (Buffer);
  'to_signature': (Buffer);
}
