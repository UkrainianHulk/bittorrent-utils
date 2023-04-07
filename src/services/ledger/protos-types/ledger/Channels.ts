// Original file: src/services/ledger/protos/ledger.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  ChannelClosed as _ledger_ChannelClosed,
  ChannelClosed__Output as _ledger_ChannelClosed__Output,
} from '../ledger/ChannelClosed';
import type {
  ChannelID as _ledger_ChannelID,
  ChannelID__Output as _ledger_ChannelID__Output,
} from '../ledger/ChannelID';
import type {
  ChannelInfo as _ledger_ChannelInfo,
  ChannelInfo__Output as _ledger_ChannelInfo__Output,
} from '../ledger/ChannelInfo';
import type {
  ClosedChannelCursor as _ledger_ClosedChannelCursor,
  ClosedChannelCursor__Output as _ledger_ClosedChannelCursor__Output,
} from '../ledger/ClosedChannelCursor';
import type {
  CreateAccountResult as _ledger_CreateAccountResult,
  CreateAccountResult__Output as _ledger_CreateAccountResult__Output,
} from '../ledger/CreateAccountResult';
import type {
  Null as _ledger_Null,
  Null__Output as _ledger_Null__Output,
} from '../ledger/Null';
import type {
  PublicKey as _ledger_PublicKey,
  PublicKey__Output as _ledger_PublicKey__Output,
} from '../ledger/PublicKey';
import type {
  SignedChannelCommit as _ledger_SignedChannelCommit,
  SignedChannelCommit__Output as _ledger_SignedChannelCommit__Output,
} from '../ledger/SignedChannelCommit';
import type {
  SignedChannelState as _ledger_SignedChannelState,
  SignedChannelState__Output as _ledger_SignedChannelState__Output,
} from '../ledger/SignedChannelState';
import type {
  SignedCreateAccountRequest as _ledger_SignedCreateAccountRequest,
  SignedCreateAccountRequest__Output as _ledger_SignedCreateAccountRequest__Output,
} from '../ledger/SignedCreateAccountRequest';
import type {
  SignedCreateAccountResult as _ledger_SignedCreateAccountResult,
  SignedCreateAccountResult__Output as _ledger_SignedCreateAccountResult__Output,
} from '../ledger/SignedCreateAccountResult';
import type {
  SignedPublicKeyPair as _ledger_SignedPublicKeyPair,
  SignedPublicKeyPair__Output as _ledger_SignedPublicKeyPair__Output,
} from '../ledger/SignedPublicKeyPair';
import type {
  SignedTransferRequest as _ledger_SignedTransferRequest,
  SignedTransferRequest__Output as _ledger_SignedTransferRequest__Output,
} from '../ledger/SignedTransferRequest';
import type {
  TransferResult as _ledger_TransferResult,
  TransferResult__Output as _ledger_TransferResult__Output,
} from '../ledger/TransferResult';

export interface ChannelsClient extends grpc.Client {
  CloseChannel(
    argument: _ledger_SignedChannelState,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelClosed__Output>
  ): grpc.ClientUnaryCall;
  CloseChannel(
    argument: _ledger_SignedChannelState,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_ChannelClosed__Output>
  ): grpc.ClientUnaryCall;
  CloseChannel(
    argument: _ledger_SignedChannelState,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelClosed__Output>
  ): grpc.ClientUnaryCall;
  CloseChannel(
    argument: _ledger_SignedChannelState,
    callback: grpc.requestCallback<_ledger_ChannelClosed__Output>
  ): grpc.ClientUnaryCall;
  closeChannel(
    argument: _ledger_SignedChannelState,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelClosed__Output>
  ): grpc.ClientUnaryCall;
  closeChannel(
    argument: _ledger_SignedChannelState,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_ChannelClosed__Output>
  ): grpc.ClientUnaryCall;
  closeChannel(
    argument: _ledger_SignedChannelState,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelClosed__Output>
  ): grpc.ClientUnaryCall;
  closeChannel(
    argument: _ledger_SignedChannelState,
    callback: grpc.requestCallback<_ledger_ChannelClosed__Output>
  ): grpc.ClientUnaryCall;

  CreateAccount(
    argument: _ledger_PublicKey,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_CreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  CreateAccount(
    argument: _ledger_PublicKey,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_CreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  CreateAccount(
    argument: _ledger_PublicKey,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_CreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  CreateAccount(
    argument: _ledger_PublicKey,
    callback: grpc.requestCallback<_ledger_CreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  createAccount(
    argument: _ledger_PublicKey,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_CreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  createAccount(
    argument: _ledger_PublicKey,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_CreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  createAccount(
    argument: _ledger_PublicKey,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_CreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  createAccount(
    argument: _ledger_PublicKey,
    callback: grpc.requestCallback<_ledger_CreateAccountResult__Output>
  ): grpc.ClientUnaryCall;

  CreateChannel(
    argument: _ledger_SignedChannelCommit,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelID__Output>
  ): grpc.ClientUnaryCall;
  CreateChannel(
    argument: _ledger_SignedChannelCommit,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_ChannelID__Output>
  ): grpc.ClientUnaryCall;
  CreateChannel(
    argument: _ledger_SignedChannelCommit,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelID__Output>
  ): grpc.ClientUnaryCall;
  CreateChannel(
    argument: _ledger_SignedChannelCommit,
    callback: grpc.requestCallback<_ledger_ChannelID__Output>
  ): grpc.ClientUnaryCall;
  createChannel(
    argument: _ledger_SignedChannelCommit,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelID__Output>
  ): grpc.ClientUnaryCall;
  createChannel(
    argument: _ledger_SignedChannelCommit,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_ChannelID__Output>
  ): grpc.ClientUnaryCall;
  createChannel(
    argument: _ledger_SignedChannelCommit,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelID__Output>
  ): grpc.ClientUnaryCall;
  createChannel(
    argument: _ledger_SignedChannelCommit,
    callback: grpc.requestCallback<_ledger_ChannelID__Output>
  ): grpc.ClientUnaryCall;

  GetChannelInfo(
    argument: _ledger_ChannelID,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  GetChannelInfo(
    argument: _ledger_ChannelID,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  GetChannelInfo(
    argument: _ledger_ChannelID,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  GetChannelInfo(
    argument: _ledger_ChannelID,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  getChannelInfo(
    argument: _ledger_ChannelID,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  getChannelInfo(
    argument: _ledger_ChannelID,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  getChannelInfo(
    argument: _ledger_ChannelID,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  getChannelInfo(
    argument: _ledger_ChannelID,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;

  GetNextClosedChannel(
    argument: _ledger_ClosedChannelCursor,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  GetNextClosedChannel(
    argument: _ledger_ClosedChannelCursor,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  GetNextClosedChannel(
    argument: _ledger_ClosedChannelCursor,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  GetNextClosedChannel(
    argument: _ledger_ClosedChannelCursor,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  getNextClosedChannel(
    argument: _ledger_ClosedChannelCursor,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  getNextClosedChannel(
    argument: _ledger_ClosedChannelCursor,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  getNextClosedChannel(
    argument: _ledger_ClosedChannelCursor,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;
  getNextClosedChannel(
    argument: _ledger_ClosedChannelCursor,
    callback: grpc.requestCallback<_ledger_ChannelInfo__Output>
  ): grpc.ClientUnaryCall;

  SignedCreateAccount(
    argument: _ledger_SignedCreateAccountRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_SignedCreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  SignedCreateAccount(
    argument: _ledger_SignedCreateAccountRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_SignedCreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  SignedCreateAccount(
    argument: _ledger_SignedCreateAccountRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_SignedCreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  SignedCreateAccount(
    argument: _ledger_SignedCreateAccountRequest,
    callback: grpc.requestCallback<_ledger_SignedCreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  signedCreateAccount(
    argument: _ledger_SignedCreateAccountRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_SignedCreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  signedCreateAccount(
    argument: _ledger_SignedCreateAccountRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_SignedCreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  signedCreateAccount(
    argument: _ledger_SignedCreateAccountRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_SignedCreateAccountResult__Output>
  ): grpc.ClientUnaryCall;
  signedCreateAccount(
    argument: _ledger_SignedCreateAccountRequest,
    callback: grpc.requestCallback<_ledger_SignedCreateAccountResult__Output>
  ): grpc.ClientUnaryCall;

  Transfer(
    argument: _ledger_SignedTransferRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_TransferResult__Output>
  ): grpc.ClientUnaryCall;
  Transfer(
    argument: _ledger_SignedTransferRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_TransferResult__Output>
  ): grpc.ClientUnaryCall;
  Transfer(
    argument: _ledger_SignedTransferRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_TransferResult__Output>
  ): grpc.ClientUnaryCall;
  Transfer(
    argument: _ledger_SignedTransferRequest,
    callback: grpc.requestCallback<_ledger_TransferResult__Output>
  ): grpc.ClientUnaryCall;
  transfer(
    argument: _ledger_SignedTransferRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_TransferResult__Output>
  ): grpc.ClientUnaryCall;
  transfer(
    argument: _ledger_SignedTransferRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_TransferResult__Output>
  ): grpc.ClientUnaryCall;
  transfer(
    argument: _ledger_SignedTransferRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_TransferResult__Output>
  ): grpc.ClientUnaryCall;
  transfer(
    argument: _ledger_SignedTransferRequest,
    callback: grpc.requestCallback<_ledger_TransferResult__Output>
  ): grpc.ClientUnaryCall;

  UpdateAccountPubKey(
    argument: _ledger_SignedPublicKeyPair,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_Null__Output>
  ): grpc.ClientUnaryCall;
  UpdateAccountPubKey(
    argument: _ledger_SignedPublicKeyPair,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_Null__Output>
  ): grpc.ClientUnaryCall;
  UpdateAccountPubKey(
    argument: _ledger_SignedPublicKeyPair,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_Null__Output>
  ): grpc.ClientUnaryCall;
  UpdateAccountPubKey(
    argument: _ledger_SignedPublicKeyPair,
    callback: grpc.requestCallback<_ledger_Null__Output>
  ): grpc.ClientUnaryCall;
  updateAccountPubKey(
    argument: _ledger_SignedPublicKeyPair,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_Null__Output>
  ): grpc.ClientUnaryCall;
  updateAccountPubKey(
    argument: _ledger_SignedPublicKeyPair,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ledger_Null__Output>
  ): grpc.ClientUnaryCall;
  updateAccountPubKey(
    argument: _ledger_SignedPublicKeyPair,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ledger_Null__Output>
  ): grpc.ClientUnaryCall;
  updateAccountPubKey(
    argument: _ledger_SignedPublicKeyPair,
    callback: grpc.requestCallback<_ledger_Null__Output>
  ): grpc.ClientUnaryCall;
}

export interface ChannelsHandlers extends grpc.UntypedServiceImplementation {
  CloseChannel: grpc.handleUnaryCall<
    _ledger_SignedChannelState__Output,
    _ledger_ChannelClosed
  >;

  CreateAccount: grpc.handleUnaryCall<
    _ledger_PublicKey__Output,
    _ledger_CreateAccountResult
  >;

  CreateChannel: grpc.handleUnaryCall<
    _ledger_SignedChannelCommit__Output,
    _ledger_ChannelID
  >;

  GetChannelInfo: grpc.handleUnaryCall<
    _ledger_ChannelID__Output,
    _ledger_ChannelInfo
  >;

  GetNextClosedChannel: grpc.handleUnaryCall<
    _ledger_ClosedChannelCursor__Output,
    _ledger_ChannelInfo
  >;

  SignedCreateAccount: grpc.handleUnaryCall<
    _ledger_SignedCreateAccountRequest__Output,
    _ledger_SignedCreateAccountResult
  >;

  Transfer: grpc.handleUnaryCall<
    _ledger_SignedTransferRequest__Output,
    _ledger_TransferResult
  >;

  UpdateAccountPubKey: grpc.handleUnaryCall<
    _ledger_SignedPublicKeyPair__Output,
    _ledger_Null
  >;
}

export interface ChannelsDefinition extends grpc.ServiceDefinition {
  CloseChannel: MethodDefinition<
    _ledger_SignedChannelState,
    _ledger_ChannelClosed,
    _ledger_SignedChannelState__Output,
    _ledger_ChannelClosed__Output
  >;
  CreateAccount: MethodDefinition<
    _ledger_PublicKey,
    _ledger_CreateAccountResult,
    _ledger_PublicKey__Output,
    _ledger_CreateAccountResult__Output
  >;
  CreateChannel: MethodDefinition<
    _ledger_SignedChannelCommit,
    _ledger_ChannelID,
    _ledger_SignedChannelCommit__Output,
    _ledger_ChannelID__Output
  >;
  GetChannelInfo: MethodDefinition<
    _ledger_ChannelID,
    _ledger_ChannelInfo,
    _ledger_ChannelID__Output,
    _ledger_ChannelInfo__Output
  >;
  GetNextClosedChannel: MethodDefinition<
    _ledger_ClosedChannelCursor,
    _ledger_ChannelInfo,
    _ledger_ClosedChannelCursor__Output,
    _ledger_ChannelInfo__Output
  >;
  SignedCreateAccount: MethodDefinition<
    _ledger_SignedCreateAccountRequest,
    _ledger_SignedCreateAccountResult,
    _ledger_SignedCreateAccountRequest__Output,
    _ledger_SignedCreateAccountResult__Output
  >;
  Transfer: MethodDefinition<
    _ledger_SignedTransferRequest,
    _ledger_TransferResult,
    _ledger_SignedTransferRequest__Output,
    _ledger_TransferResult__Output
  >;
  UpdateAccountPubKey: MethodDefinition<
    _ledger_SignedPublicKeyPair,
    _ledger_Null,
    _ledger_SignedPublicKeyPair__Output,
    _ledger_Null__Output
  >;
}
