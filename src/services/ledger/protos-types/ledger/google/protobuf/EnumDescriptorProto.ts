// Original file: src/services/ledger/protos/descriptor.proto

import type { EnumValueDescriptorProto as _google_protobuf_EnumValueDescriptorProto, EnumValueDescriptorProto__Output as _google_protobuf_EnumValueDescriptorProto__Output } from '../../google/protobuf/EnumValueDescriptorProto';
import type { EnumOptions as _google_protobuf_EnumOptions, EnumOptions__Output as _google_protobuf_EnumOptions__Output } from '../../google/protobuf/EnumOptions';

export interface _google_protobuf_EnumDescriptorProto_EnumReservedRange {
  'start'?: (number);
  'end'?: (number);
}

export interface _google_protobuf_EnumDescriptorProto_EnumReservedRange__Output {
  'start': (number);
  'end': (number);
}

export interface EnumDescriptorProto {
  'name'?: (string);
  'value'?: (_google_protobuf_EnumValueDescriptorProto)[];
  'options'?: (_google_protobuf_EnumOptions | null);
  'reserved_range'?: (_google_protobuf_EnumDescriptorProto_EnumReservedRange)[];
  'reserved_name'?: (string)[];
}

export interface EnumDescriptorProto__Output {
  'name': (string);
  'value': (_google_protobuf_EnumValueDescriptorProto__Output)[];
  'options': (_google_protobuf_EnumOptions__Output | null);
  'reserved_range': (_google_protobuf_EnumDescriptorProto_EnumReservedRange__Output)[];
  'reserved_name': (string)[];
}
