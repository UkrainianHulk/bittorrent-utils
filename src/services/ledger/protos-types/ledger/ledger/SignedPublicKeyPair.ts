// Original file: src/services/ledger/protos/ledger.proto

import type { PublicKey as _ledger_PublicKey, PublicKey__Output as _ledger_PublicKey__Output } from '../ledger/PublicKey';

export interface SignedPublicKeyPair {
  'old_key'?: (_ledger_PublicKey | null);
  'new_key'?: (_ledger_PublicKey | null);
  'old_signature'?: (Buffer | Uint8Array | string);
  'new_signature'?: (Buffer | Uint8Array | string);
}

export interface SignedPublicKeyPair__Output {
  'old_key': (_ledger_PublicKey__Output | null);
  'new_key': (_ledger_PublicKey__Output | null);
  'old_signature': (Buffer);
  'new_signature': (Buffer);
}
