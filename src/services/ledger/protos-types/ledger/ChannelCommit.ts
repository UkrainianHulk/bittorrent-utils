// Original file: src/services/ledger/protos/ledger.proto

import type {
  PublicKey as _ledger_PublicKey,
  PublicKey__Output as _ledger_PublicKey__Output,
} from '../ledger/PublicKey';
import type { Long } from '@grpc/proto-loader';

export interface ChannelCommit {
  payer?: _ledger_PublicKey | null;
  recipient?: _ledger_PublicKey | null;
  amount?: number | string | Long;
  payer_id?: number | string | Long;
}

export interface ChannelCommit__Output {
  payer: _ledger_PublicKey__Output | null;
  recipient: _ledger_PublicKey__Output | null;
  amount: string;
  payer_id: string;
}
