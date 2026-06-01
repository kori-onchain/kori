import { Buffer } from "buffer";

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function decodeCompactU16(bytes: Uint8Array, offset: number) {
  let value = 0;
  let shift = 0;
  let cursor = offset;

  while (true) {
    const byte = bytes[cursor++];
    value |= (byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) break;
    shift += 7;
  }

  return { value, nextOffset: cursor };
}

function decodeBase58(value: string) {
  const output = [0];

  for (const char of value) {
    const digit = BASE58_ALPHABET.indexOf(char);
    if (digit < 0) throw new Error("Endereco Solana invalido.");

    let carry = digit;
    for (let index = 0; index < output.length; index += 1) {
      carry += output[index] * 58;
      output[index] = carry & 0xff;
      carry >>= 8;
    }

    while (carry > 0) {
      output.push(carry & 0xff);
      carry >>= 8;
    }
  }

  for (const char of value) {
    if (char !== "1") break;
    output.push(0);
  }

  return Uint8Array.from(output.reverse());
}

function bytesEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  return left.every((byte, index) => byte === right[index]);
}

function findSignatureIndex(transaction: Uint8Array, signerAddress: string) {
  const signatureCount = decodeCompactU16(transaction, 0);
  const signaturesStart = signatureCount.nextOffset;
  const messageStart = signaturesStart + signatureCount.value * 64;
  const headerStart = messageStart;
  const requiredSignatures = transaction[headerStart];
  const accountKeysLength = decodeCompactU16(transaction, headerStart + 3);
  const accountKeysStart = accountKeysLength.nextOffset;
  const signerPublicKey = decodeBase58(signerAddress);

  for (let index = 0; index < requiredSignatures; index += 1) {
    const keyStart = accountKeysStart + index * 32;
    const accountKey = transaction.slice(keyStart, keyStart + 32);
    if (bytesEqual(accountKey, signerPublicKey)) {
      return { index, messageStart, signaturesStart };
    }
  }

  throw new Error("Carteira Privy nao e assinante desta transacao.");
}

export async function signSerializedTransactionWithPrivy(params: {
  provider: any;
  transaction: Uint8Array;
  signerAddress: string;
}) {
  const { provider, signerAddress } = params;
  const transaction = Uint8Array.from(params.transaction);
  const { index, messageStart, signaturesStart } = findSignatureIndex(
    transaction,
    signerAddress,
  );
  const message = transaction.slice(messageStart);
  const signed = await provider.request({
    method: "signMessage",
    params: {
      message: Buffer.from(message).toString("base64"),
    },
  });
  const signature = Uint8Array.from(Buffer.from(signed.signature, "base64"));

  if (signature.length !== 64) {
    throw new Error("Assinatura Solana invalida retornada pelo Privy.");
  }

  transaction.set(signature, signaturesStart + index * 64);
  return transaction;
}
