// Original file: src/services/ledger/protos/ledger.proto

import type { ChannelID as _ledger_ChannelID, ChannelID__Output as _ledger_ChannelID__Output } from '../ledger/ChannelID';
import type { Account as _ledger_Account, Account__Output as _ledger_Account__Output } from '../ledger/Account';
import type { Long } from '@grpc/proto-loader';

export interface ChannelState {
  'id'?: (_ledger_ChannelID | null);
  'sequence'?: (number | string | Long);
  'from'?: (_ledger_Account | null);
  'to'?: (_ledger_Account | null);
}

export interface ChannelState__Output {
  'id': (_ledger_ChannelID__Output | null);
  'sequence': (string);
  'from': (_ledger_Account__Output | null);
  'to': (_ledger_Account__Output | null);
}
