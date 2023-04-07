// Original file: src/services/ledger/protos/ledger.proto

import type {
  PublicKey as _ledger_PublicKey,
  PublicKey__Output as _ledger_PublicKey__Output,
} from '../ledger/PublicKey';
import type { Long } from '@grpc/proto-loader';

export interface Account {
  address?: _ledger_PublicKey | null;
  balance?: number | string | Long;
}

export interface Account__Output {
  address: _ledger_PublicKey__Output | null;
  balance: string;
}
