// Original file: src/services/ledger/protos/ledger.proto

import type {
  PublicKey as _ledger_PublicKey,
  PublicKey__Output as _ledger_PublicKey__Output,
} from '../ledger/PublicKey';
import type { Long } from '@grpc/proto-loader';

export interface ClosedChannelCursor {
  payer?: _ledger_PublicKey | null;
  close_sequence?: number | string | Long;
}

export interface ClosedChannelCursor__Output {
  payer: _ledger_PublicKey__Output | null;
  close_sequence: string;
}
