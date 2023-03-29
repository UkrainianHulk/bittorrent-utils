// Original file: src/services/ledger/protos/descriptor.proto

import type { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from '../../google/protobuf/FieldDescriptorProto';
import type { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from '../../google/protobuf/DescriptorProto';
import type { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from '../../google/protobuf/EnumDescriptorProto';
import type { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from '../../google/protobuf/MessageOptions';
import type { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from '../../google/protobuf/OneofDescriptorProto';
import type { ExtensionRangeOptions as _google_protobuf_ExtensionRangeOptions, ExtensionRangeOptions__Output as _google_protobuf_ExtensionRangeOptions__Output } from '../../google/protobuf/ExtensionRangeOptions';

export interface _google_protobuf_DescriptorProto_ExtensionRange {
  'start'?: (number);
  'end'?: (number);
  'options'?: (_google_protobuf_ExtensionRangeOptions | null);
}

export interface _google_protobuf_DescriptorProto_ExtensionRange__Output {
  'start': (number);
  'end': (number);
  'options': (_google_protobuf_ExtensionRangeOptions__Output | null);
}

export interface _google_protobuf_DescriptorProto_ReservedRange {
  'start'?: (number);
  'end'?: (number);
}

export interface _google_protobuf_DescriptorProto_ReservedRange__Output {
  'start': (number);
  'end': (number);
}

export interface DescriptorProto {
  'name'?: (string);
  'field'?: (_google_protobuf_FieldDescriptorProto)[];
  'nested_type'?: (_google_protobuf_DescriptorProto)[];
  'enum_type'?: (_google_protobuf_EnumDescriptorProto)[];
  'extension_range'?: (_google_protobuf_DescriptorProto_ExtensionRange)[];
  'extension'?: (_google_protobuf_FieldDescriptorProto)[];
  'options'?: (_google_protobuf_MessageOptions | null);
  'oneof_decl'?: (_google_protobuf_OneofDescriptorProto)[];
  'reserved_range'?: (_google_protobuf_DescriptorProto_ReservedRange)[];
  'reserved_name'?: (string)[];
}

export interface DescriptorProto__Output {
  'name': (string);
  'field': (_google_protobuf_FieldDescriptorProto__Output)[];
  'nested_type': (_google_protobuf_DescriptorProto__Output)[];
  'enum_type': (_google_protobuf_EnumDescriptorProto__Output)[];
  'extension_range': (_google_protobuf_DescriptorProto_ExtensionRange__Output)[];
  'extension': (_google_protobuf_FieldDescriptorProto__Output)[];
  'options': (_google_protobuf_MessageOptions__Output | null);
  'oneof_decl': (_google_protobuf_OneofDescriptorProto__Output)[];
  'reserved_range': (_google_protobuf_DescriptorProto_ReservedRange__Output)[];
  'reserved_name': (string)[];
}
