// Original file: src/services/ledger/protos/ledger.proto

import type {
  Account as _ledger_Account,
  Account__Output as _ledger_Account__Output,
} from '../ledger/Account';

export interface CreateAccountResult {
  account?: _ledger_Account | null;
}

export interface CreateAccountResult__Output {
  account: _ledger_Account__Output | null;
}
