// Original file: src/services/ledger/protos/ledger.proto

import type { Long } from '@grpc/proto-loader';

export interface TransferResult {
  balance?: number | string | Long;
}

export interface TransferResult__Output {
  balance: string;
}
