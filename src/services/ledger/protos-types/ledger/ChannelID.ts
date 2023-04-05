// Original file: src/services/ledger/protos/ledger.proto

import type { Long } from '@grpc/proto-loader';

export interface ChannelID {
  id?: number | string | Long;
}

export interface ChannelID__Output {
  id: string;
}
