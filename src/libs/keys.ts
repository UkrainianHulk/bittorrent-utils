import crypto from 'node:crypto';
import secp256k1 from 'secp256k1';
import createKeccakHash from 'keccak';
import base58 from 'bs58';

export class PrivateKey {
  readonly string: string;
  readonly buffer: Buffer;
  readonly public: PublicKey;

  constructor(privateKeyString: string) {
    this.string = privateKeyString;
    this.buffer = Buffer.from(privateKeyString, 'hex');
    if (!secp256k1.privateKeyVerify(this.buffer))
      throw new Error(`Private key "${privateKeyString}" verification failed`);
    const publicKeyString =
      PrivateKey.privateKeyStringToPublicKeyString(privateKeyString);
    this.public = new PublicKey(publicKeyString);
  }

  static privateKeyStringToPublicKeyString(privateKeyString: string): string {
    const privateKeyBuffer = Buffer.from(privateKeyString, 'hex');
    if (!secp256k1.privateKeyVerify(privateKeyBuffer))
      throw new Error(`Private key "${privateKeyString}" verification failed`);
    const uncompressedPublicKeyBuffer = Buffer.from(
      secp256k1.publicKeyCreate(privateKeyBuffer, false)
    );
    return uncompressedPublicKeyBuffer.toString('base64');
  }

  hashAndSign(message: Uint8Array): Uint8Array {
    const messageHash = crypto.createHash('sha256').update(message).digest();
    const signature = secp256k1.ecdsaSign(messageHash, this.buffer).signature;
    const verified = secp256k1.ecdsaVerify(
      signature,
      messageHash,
      this.public.uncompressedUint8Array
    );
    if (!verified) throw new Error('Signature verification failed');
    return secp256k1.signatureExport(signature);
  }
}

export class PublicKey {
  readonly string: string;
  readonly compressedBuffer: Buffer;
  readonly uncompressedBuffer: Buffer;
  readonly uncompressedUint8Array: Uint8Array;

  constructor(publicKeyString: string) {
    this.string = publicKeyString;
    this.uncompressedBuffer = Buffer.from(publicKeyString, 'base64');
    if (!secp256k1.publicKeyVerify(this.uncompressedBuffer))
      throw new Error(`Public key "${publicKeyString}" verification failed`);
    this.compressedBuffer = Buffer.from(
      secp256k1.publicKeyConvert(this.uncompressedBuffer, true)
    );
    if (!secp256k1.publicKeyVerify(this.compressedBuffer))
      throw new Error(`Public key "${publicKeyString}" verification failed`);
    this.uncompressedUint8Array = new Uint8Array(this.uncompressedBuffer);
  }

  toTronAddress(): string {
    const P = this.uncompressedBuffer.subarray(1, 65);
    const slicedKeccak256 = createKeccakHash('keccak256')
      .update(P)
      .digest()
      .slice(12, 32);
    const prefix = Buffer.from([parseInt('0x41')]);
    const H = Buffer.concat([prefix, slicedKeccak256]);
    const h1 = crypto.createHash('sha256').update(H).digest();
    const h2 = crypto.createHash('sha256').update(h1).digest();
    const tronAddress = base58.encode(Buffer.concat([H, h2.subarray(0, 4)]));
    return tronAddress;
  }
}
