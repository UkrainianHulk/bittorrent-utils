import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  ChannelsClient as _ledger_ChannelsClient,
  ChannelsDefinition as _ledger_ChannelsDefinition,
} from './ledger/Channels';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  gogoproto: {};
  google: {
    protobuf: {
      DescriptorProto: MessageTypeDefinition;
      EnumDescriptorProto: MessageTypeDefinition;
      EnumOptions: MessageTypeDefinition;
      EnumValueDescriptorProto: MessageTypeDefinition;
      EnumValueOptions: MessageTypeDefinition;
      ExtensionRangeOptions: MessageTypeDefinition;
      FieldDescriptorProto: MessageTypeDefinition;
      FieldOptions: MessageTypeDefinition;
      FileDescriptorProto: MessageTypeDefinition;
      FileDescriptorSet: MessageTypeDefinition;
      FileOptions: MessageTypeDefinition;
      GeneratedCodeInfo: MessageTypeDefinition;
      MessageOptions: MessageTypeDefinition;
      MethodDescriptorProto: MessageTypeDefinition;
      MethodOptions: MessageTypeDefinition;
      OneofDescriptorProto: MessageTypeDefinition;
      OneofOptions: MessageTypeDefinition;
      ServiceDescriptorProto: MessageTypeDefinition;
      ServiceOptions: MessageTypeDefinition;
      SourceCodeInfo: MessageTypeDefinition;
      UninterpretedOption: MessageTypeDefinition;
    };
  };
  ledger: {
    Account: MessageTypeDefinition;
    ChannelClosed: MessageTypeDefinition;
    ChannelCommit: MessageTypeDefinition;
    ChannelID: MessageTypeDefinition;
    ChannelInfo: MessageTypeDefinition;
    ChannelState: MessageTypeDefinition;
    Channels: SubtypeConstructor<typeof grpc.Client, _ledger_ChannelsClient> & {
      service: _ledger_ChannelsDefinition;
    };
    ClosedChannelCursor: MessageTypeDefinition;
    CreateAccountResult: MessageTypeDefinition;
    Null: MessageTypeDefinition;
    PublicKey: MessageTypeDefinition;
    SignedChannelCommit: MessageTypeDefinition;
    SignedChannelState: MessageTypeDefinition;
    SignedCreateAccountRequest: MessageTypeDefinition;
    SignedCreateAccountResult: MessageTypeDefinition;
    SignedPublicKey: MessageTypeDefinition;
    SignedPublicKeyPair: MessageTypeDefinition;
    SignedTransferRequest: MessageTypeDefinition;
    TransferRequest: MessageTypeDefinition;
    TransferResult: MessageTypeDefinition;
  };
}
