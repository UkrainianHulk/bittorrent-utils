import crypto from 'node:crypto'
import secp256k1 from 'secp256k1'
import createKeccakHash from 'keccak'
import base58 from 'b58'

export class PrivateKey {
  #string
  #buffer
  #public

  get string() {
    return this.#string
  }

  get buffer() {
    return this.#buffer
  }

  get public() {
    return this.#public
  }

  constructor(privateKeyString) {
    this.#string = privateKeyString
    this.#buffer = Buffer.from(privateKeyString, 'hex')
    if (!secp256k1.privateKeyVerify(this.#buffer)) {
      throw new Error(`Private key ${privateKeyString} verification failed`)
    }
    const publicKeyString = PrivateKey.privateKeyStringToPublicKeyString(privateKeyString)
    this.#public = new PublicKey(publicKeyString)
  }

  static privateKeyStringToPublicKeyString(privateKeyString) {
    const privateKeyBuffer = Buffer.from(privateKeyString, 'hex')
    if (!secp256k1.privateKeyVerify(privateKeyBuffer)) {
      throw new Error(`Private key ${privateKeyString} verification failed`)
    }
    const compressed = Buffer.from(secp256k1.publicKeyCreate(privateKeyBuffer))
    const uncompressed = Buffer.from(secp256k1.publicKeyConvert(compressed, false))
    return uncompressed.toString('base64')
  }

  hashAndSign(message) {
    const messageHash = crypto.createHash('sha256').update(message).digest()
    const signature = secp256k1.ecdsaSign(messageHash, this.#buffer).signature
    const verified = secp256k1.ecdsaVerify(signature, messageHash, this.#public.uncompressedUint8Array)
    if (!verified) throw new Error('Signature verification failed')
    return secp256k1.signatureExport(signature)
  }
}

export class PublicKey {
  #string
  #bufferCompressed
  #bufferUncompressed
  #uint8ArrayUncompressed

  get string() {
    return this.#string
  }

  get bufferCompressed() {
    return this.#bufferCompressed
  }

  get bufferUncompressed() {
    return this.#bufferUncompressed
  }

  get uncompressedUint8Array() {
    return this.#uint8ArrayUncompressed
  }

  constructor(publicKeyString) {
    this.#string = publicKeyString
    this.#bufferUncompressed = Buffer.from(publicKeyString, 'base64')
    if (!secp256k1.publicKeyVerify(this.#bufferUncompressed)) {
      throw new Error(`Public key ${publicKeyString} verification failed`)
    }
    this.#bufferCompressed = Buffer.from(secp256k1.publicKeyConvert(this.#bufferUncompressed, true))
    if (!secp256k1.publicKeyVerify(this.#bufferCompressed)) {
      throw new Error(`Public key ${publicKeyString} verification failed`)
    }
    this.#uint8ArrayUncompressed = new Uint8Array(this.#bufferUncompressed)
  }

  toTronAdress() {
    const P = this.#bufferUncompressed.slice(1, 65)
    const slicedKeccak256 = createKeccakHash('keccak256').update(P).digest().slice(12, 32)
    const prefix = Buffer.from([parseInt('0x41')])
    const H = Buffer.concat([prefix, slicedKeccak256])
    const h1 = crypto.createHash('sha256').update(H).digest()
    const h2 = crypto.createHash('sha256').update(h1).digest()
    const tronAdress = base58.encode(Buffer.concat([H, h2.slice(0, 4)]))
    return tronAdress
  }
}
