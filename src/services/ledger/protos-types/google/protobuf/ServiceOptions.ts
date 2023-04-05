// Original file: src/services/ledger/protos/descriptor.proto

import type {
  UninterpretedOption as _google_protobuf_UninterpretedOption,
  UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output,
} from '../../google/protobuf/UninterpretedOption';

export interface ServiceOptions {
  deprecated?: boolean;
  uninterpreted_option?: _google_protobuf_UninterpretedOption[];
}

export interface ServiceOptions__Output {
  deprecated: boolean;
  uninterpreted_option: _google_protobuf_UninterpretedOption__Output[];
}
