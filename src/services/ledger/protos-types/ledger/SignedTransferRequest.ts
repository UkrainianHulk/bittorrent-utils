// Original file: src/services/ledger/protos/ledger.proto

import type {
  TransferRequest as _ledger_TransferRequest,
  TransferRequest__Output as _ledger_TransferRequest__Output,
} from '../ledger/TransferRequest';

export interface SignedTransferRequest {
  transfer_request?: _ledger_TransferRequest | null;
  signature?: Buffer | Uint8Array | string;
}

export interface SignedTransferRequest__Output {
  transfer_request: _ledger_TransferRequest__Output | null;
  signature: Buffer;
}
