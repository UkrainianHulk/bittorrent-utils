// Original file: src/services/ledger/protos/descriptor.proto

import type {
  DescriptorProto as _google_protobuf_DescriptorProto,
  DescriptorProto__Output as _google_protobuf_DescriptorProto__Output,
} from '../../google/protobuf/DescriptorProto';
import type {
  EnumDescriptorProto as _google_protobuf_EnumDescriptorProto,
  EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output,
} from '../../google/protobuf/EnumDescriptorProto';
import type {
  ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto,
  ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output,
} from '../../google/protobuf/ServiceDescriptorProto';
import type {
  FieldDescriptorProto as _google_protobuf_FieldDescriptorProto,
  FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output,
} from '../../google/protobuf/FieldDescriptorProto';
import type {
  FileOptions as _google_protobuf_FileOptions,
  FileOptions__Output as _google_protobuf_FileOptions__Output,
} from '../../google/protobuf/FileOptions';
import type {
  SourceCodeInfo as _google_protobuf_SourceCodeInfo,
  SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output,
} from '../../google/protobuf/SourceCodeInfo';

export interface FileDescriptorProto {
  name?: string;
  package?: string;
  dependency?: string[];
  message_type?: _google_protobuf_DescriptorProto[];
  enum_type?: _google_protobuf_EnumDescriptorProto[];
  service?: _google_protobuf_ServiceDescriptorProto[];
  extension?: _google_protobuf_FieldDescriptorProto[];
  options?: _google_protobuf_FileOptions | null;
  source_code_info?: _google_protobuf_SourceCodeInfo | null;
  public_dependency?: number[];
  weak_dependency?: number[];
  syntax?: string;
}

export interface FileDescriptorProto__Output {
  name: string;
  package: string;
  dependency: string[];
  message_type: _google_protobuf_DescriptorProto__Output[];
  enum_type: _google_protobuf_EnumDescriptorProto__Output[];
  service: _google_protobuf_ServiceDescriptorProto__Output[];
  extension: _google_protobuf_FieldDescriptorProto__Output[];
  options: _google_protobuf_FileOptions__Output | null;
  source_code_info: _google_protobuf_SourceCodeInfo__Output | null;
  public_dependency: number[];
  weak_dependency: number[];
  syntax: string;
}
