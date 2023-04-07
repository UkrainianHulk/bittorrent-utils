// Original file: src/services/ledger/protos/ledger.proto

import type { Long } from '@grpc/proto-loader';

export interface SignedCreateAccountResult {
  balance?: number | string | Long;
}

export interface SignedCreateAccountResult__Output {
  balance: string;
}
