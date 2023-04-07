// Original file: src/services/ledger/protos/descriptor.proto

import type {
  UninterpretedOption as _google_protobuf_UninterpretedOption,
  UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output,
} from '../../google/protobuf/UninterpretedOption';

// Original file: src/services/ledger/protos/descriptor.proto

export const _google_protobuf_FileOptions_OptimizeMode = {
  SPEED: 'SPEED',
  CODE_SIZE: 'CODE_SIZE',
  LITE_RUNTIME: 'LITE_RUNTIME',
} as const;

export type _google_protobuf_FileOptions_OptimizeMode =
  | 'SPEED'
  | 1
  | 'CODE_SIZE'
  | 2
  | 'LITE_RUNTIME'
  | 3;

export type _google_protobuf_FileOptions_OptimizeMode__Output =
  (typeof _google_protobuf_FileOptions_OptimizeMode)[keyof typeof _google_protobuf_FileOptions_OptimizeMode];

export interface FileOptions {
  java_package?: string;
  java_outer_classname?: string;
  optimize_for?: _google_protobuf_FileOptions_OptimizeMode;
  java_multiple_files?: boolean;
  go_package?: string;
  cc_generic_services?: boolean;
  java_generic_services?: boolean;
  py_generic_services?: boolean;
  java_generate_equals_and_hash?: boolean;
  deprecated?: boolean;
  java_string_check_utf8?: boolean;
  cc_enable_arenas?: boolean;
  objc_class_prefix?: string;
  csharp_namespace?: string;
  swift_prefix?: string;
  php_class_prefix?: string;
  php_namespace?: string;
  php_generic_services?: boolean;
  php_metadata_namespace?: string;
  ruby_package?: string;
  uninterpreted_option?: _google_protobuf_UninterpretedOption[];
  '.gogoproto.goproto_getters_all'?: boolean;
  '.gogoproto.goproto_enum_prefix_all'?: boolean;
  '.gogoproto.goproto_stringer_all'?: boolean;
  '.gogoproto.verbose_equal_all'?: boolean;
  '.gogoproto.face_all'?: boolean;
  '.gogoproto.gostring_all'?: boolean;
  '.gogoproto.populate_all'?: boolean;
  '.gogoproto.stringer_all'?: boolean;
  '.gogoproto.onlyone_all'?: boolean;
  '.gogoproto.equal_all'?: boolean;
  '.gogoproto.description_all'?: boolean;
  '.gogoproto.testgen_all'?: boolean;
  '.gogoproto.benchgen_all'?: boolean;
  '.gogoproto.marshaler_all'?: boolean;
  '.gogoproto.unmarshaler_all'?: boolean;
  '.gogoproto.stable_marshaler_all'?: boolean;
  '.gogoproto.sizer_all'?: boolean;
  '.gogoproto.goproto_enum_stringer_all'?: boolean;
  '.gogoproto.enum_stringer_all'?: boolean;
  '.gogoproto.unsafe_marshaler_all'?: boolean;
  '.gogoproto.unsafe_unmarshaler_all'?: boolean;
  '.gogoproto.goproto_extensions_map_all'?: boolean;
  '.gogoproto.goproto_unrecognized_all'?: boolean;
  '.gogoproto.gogoproto_import'?: boolean;
  '.gogoproto.protosizer_all'?: boolean;
  '.gogoproto.compare_all'?: boolean;
  '.gogoproto.typedecl_all'?: boolean;
  '.gogoproto.enumdecl_all'?: boolean;
  '.gogoproto.goproto_registration'?: boolean;
  '.gogoproto.messagename_all'?: boolean;
  '.gogoproto.goproto_sizecache_all'?: boolean;
  '.gogoproto.goproto_unkeyed_all'?: boolean;
  '.gogoproto.json_no_omit_empty_all'?: boolean;
}

export interface FileOptions__Output {
  java_package: string;
  java_outer_classname: string;
  optimize_for: _google_protobuf_FileOptions_OptimizeMode__Output;
  java_multiple_files: boolean;
  go_package: string;
  cc_generic_services: boolean;
  java_generic_services: boolean;
  py_generic_services: boolean;
  java_generate_equals_and_hash: boolean;
  deprecated: boolean;
  java_string_check_utf8: boolean;
  cc_enable_arenas: boolean;
  objc_class_prefix: string;
  csharp_namespace: string;
  swift_prefix: string;
  php_class_prefix: string;
  php_namespace: string;
  php_generic_services: boolean;
  php_metadata_namespace: string;
  ruby_package: string;
  uninterpreted_option: _google_protobuf_UninterpretedOption__Output[];
  '.gogoproto.goproto_getters_all': boolean;
  '.gogoproto.goproto_enum_prefix_all': boolean;
  '.gogoproto.goproto_stringer_all': boolean;
  '.gogoproto.verbose_equal_all': boolean;
  '.gogoproto.face_all': boolean;
  '.gogoproto.gostring_all': boolean;
  '.gogoproto.populate_all': boolean;
  '.gogoproto.stringer_all': boolean;
  '.gogoproto.onlyone_all': boolean;
  '.gogoproto.equal_all': boolean;
  '.gogoproto.description_all': boolean;
  '.gogoproto.testgen_all': boolean;
  '.gogoproto.benchgen_all': boolean;
  '.gogoproto.marshaler_all': boolean;
  '.gogoproto.unmarshaler_all': boolean;
  '.gogoproto.stable_marshaler_all': boolean;
  '.gogoproto.sizer_all': boolean;
  '.gogoproto.goproto_enum_stringer_all': boolean;
  '.gogoproto.enum_stringer_all': boolean;
  '.gogoproto.unsafe_marshaler_all': boolean;
  '.gogoproto.unsafe_unmarshaler_all': boolean;
  '.gogoproto.goproto_extensions_map_all': boolean;
  '.gogoproto.goproto_unrecognized_all': boolean;
  '.gogoproto.gogoproto_import': boolean;
  '.gogoproto.protosizer_all': boolean;
  '.gogoproto.compare_all': boolean;
  '.gogoproto.typedecl_all': boolean;
  '.gogoproto.enumdecl_all': boolean;
  '.gogoproto.goproto_registration': boolean;
  '.gogoproto.messagename_all': boolean;
  '.gogoproto.goproto_sizecache_all': boolean;
  '.gogoproto.goproto_unkeyed_all': boolean;
  '.gogoproto.json_no_omit_empty_all': boolean;
}
