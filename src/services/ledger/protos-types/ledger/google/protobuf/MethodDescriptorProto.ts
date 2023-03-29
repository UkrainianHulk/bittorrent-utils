// Original file: src/services/ledger/protos/descriptor.proto

import type { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from '../../google/protobuf/MethodOptions';

export interface MethodDescriptorProto {
  'name'?: (string);
  'input_type'?: (string);
  'output_type'?: (string);
  'options'?: (_google_protobuf_MethodOptions | null);
  'client_streaming'?: (boolean);
  'server_streaming'?: (boolean);
}

export interface MethodDescriptorProto__Output {
  'name': (string);
  'input_type': (string);
  'output_type': (string);
  'options': (_google_protobuf_MethodOptions__Output | null);
  'client_streaming': (boolean);
  'server_streaming': (boolean);
}
