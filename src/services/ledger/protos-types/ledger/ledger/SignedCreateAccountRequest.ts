// Original file: src/services/ledger/protos/ledger.proto

import type { PublicKey as _ledger_PublicKey, PublicKey__Output as _ledger_PublicKey__Output } from '../ledger/PublicKey';

export interface SignedCreateAccountRequest {
  'key'?: (_ledger_PublicKey | null);
  'signature'?: (Buffer | Uint8Array | string);
  'client_version_number'?: (string);
}

export interface SignedCreateAccountRequest__Output {
  'key': (_ledger_PublicKey__Output | null);
  'signature': (Buffer);
  'client_version_number': (string);
}
