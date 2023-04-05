// Original file: src/services/ledger/protos/descriptor.proto

import type {
  UninterpretedOption as _google_protobuf_UninterpretedOption,
  UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output,
} from '../../google/protobuf/UninterpretedOption';

// Original file: src/services/ledger/protos/descriptor.proto

export const _google_protobuf_MethodOptions_IdempotencyLevel = {
  IDEMPOTENCY_UNKNOWN: 'IDEMPOTENCY_UNKNOWN',
  NO_SIDE_EFFECTS: 'NO_SIDE_EFFECTS',
  IDEMPOTENT: 'IDEMPOTENT',
} as const;

export type _google_protobuf_MethodOptions_IdempotencyLevel =
  | 'IDEMPOTENCY_UNKNOWN'
  | 0
  | 'NO_SIDE_EFFECTS'
  | 1
  | 'IDEMPOTENT'
  | 2;

export type _google_protobuf_MethodOptions_IdempotencyLevel__Output =
  (typeof _google_protobuf_MethodOptions_IdempotencyLevel)[keyof typeof _google_protobuf_MethodOptions_IdempotencyLevel];

export interface MethodOptions {
  deprecated?: boolean;
  idempotency_level?: _google_protobuf_MethodOptions_IdempotencyLevel;
  uninterpreted_option?: _google_protobuf_UninterpretedOption[];
}

export interface MethodOptions__Output {
  deprecated: boolean;
  idempotency_level: _google_protobuf_MethodOptions_IdempotencyLevel__Output;
  uninterpreted_option: _google_protobuf_UninterpretedOption__Output[];
}
