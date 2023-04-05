// Original file: src/services/ledger/protos/ledger.proto

import type {
  PublicKey as _ledger_PublicKey,
  PublicKey__Output as _ledger_PublicKey__Output,
} from '../ledger/PublicKey';

export interface SignedPublicKey {
  key?: _ledger_PublicKey | null;
  signature?: Buffer | Uint8Array | string;
}

export interface SignedPublicKey__Output {
  key: _ledger_PublicKey__Output | null;
  signature: Buffer;
}
