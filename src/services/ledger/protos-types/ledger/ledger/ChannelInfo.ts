// Original file: src/services/ledger/protos/ledger.proto

import type { ChannelID as _ledger_ChannelID, ChannelID__Output as _ledger_ChannelID__Output } from '../ledger/ChannelID';
import type { Account as _ledger_Account, Account__Output as _ledger_Account__Output } from '../ledger/Account';
import type { Long } from '@grpc/proto-loader';

export interface ChannelInfo {
  'id'?: (_ledger_ChannelID | null);
  'from_account'?: (_ledger_Account | null);
  'to_account'?: (_ledger_Account | null);
  'close_sequence'?: (number | string | Long);
}

export interface ChannelInfo__Output {
  'id': (_ledger_ChannelID__Output | null);
  'from_account': (_ledger_Account__Output | null);
  'to_account': (_ledger_Account__Output | null);
  'close_sequence': (string);
}
