// Original file: src/services/ledger/protos/ledger.proto

import type {
  PublicKey as _ledger_PublicKey,
  PublicKey__Output as _ledger_PublicKey__Output,
} from '../ledger/PublicKey';
import type { Long } from '@grpc/proto-loader';

export interface TransferRequest {
  payer?: _ledger_PublicKey | null;
  recipient?: _ledger_PublicKey | null;
  amount?: number | string | Long;
}

export interface TransferRequest__Output {
  payer: _ledger_PublicKey__Output | null;
  recipient: _ledger_PublicKey__Output | null;
  amount: string;
}
