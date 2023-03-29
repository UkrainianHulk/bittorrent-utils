// Original file: src/services/ledger/protos/descriptor.proto

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';

export interface EnumOptions {
  'allow_alias'?: (boolean);
  'deprecated'?: (boolean);
  'uninterpreted_option'?: (_google_protobuf_UninterpretedOption)[];
  '.gogoproto.goproto_enum_prefix'?: (boolean);
  '.gogoproto.goproto_enum_stringer'?: (boolean);
  '.gogoproto.enum_stringer'?: (boolean);
  '.gogoproto.enum_customname'?: (string);
  '.gogoproto.enumdecl'?: (boolean);
}

export interface EnumOptions__Output {
  'allow_alias': (boolean);
  'deprecated': (boolean);
  'uninterpreted_option': (_google_protobuf_UninterpretedOption__Output)[];
  '.gogoproto.goproto_enum_prefix': (boolean);
  '.gogoproto.goproto_enum_stringer': (boolean);
  '.gogoproto.enum_stringer': (boolean);
  '.gogoproto.enum_customname': (string);
  '.gogoproto.enumdecl': (boolean);
}
