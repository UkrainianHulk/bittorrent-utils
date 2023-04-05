// Original file: src/services/ledger/protos/ledger.proto

import type {
  SignedChannelState as _ledger_SignedChannelState,
  SignedChannelState__Output as _ledger_SignedChannelState__Output,
} from '../ledger/SignedChannelState';

export interface ChannelClosed {
  state?: _ledger_SignedChannelState | null;
}

export interface ChannelClosed__Output {
  state: _ledger_SignedChannelState__Output | null;
}
