import nacl from "tweetnacl";
import bs58 from "bs58";

interface EncryptPayloadParams {
  payload: string;
  sharedSecret: string; // Se espera que el sharedSecret sea enviado como un string codificado en base58
}

interface EncryptedData {
  nonce: string;
  encryptedPayload: string;
}

export const encryptPayload = ({ payload, sharedSecret }: EncryptPayloadParams): EncryptedData => {
  const nonce = nacl.randomBytes(24); // Genera un nonce aleatorio

  // Decodifica el sharedSecret de base58 a Uint8Array
  const sharedSecretUint8Array = bs58.decode(sharedSecret);

  if (sharedSecretUint8Array.length !== 32) {
    throw new Error('Invalid sharedSecret length: must be 32 bytes');
  }

  // Cifra el payload usando nacl.box.after con el sharedSecret decodificado y el nonce
  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)), // Convierte el payload a Buffer
    nonce,
    sharedSecretUint8Array
  );

  // Codifica el nonce y el payload cifrado en base58
  const encodedNonce = bs58.encode(nonce);
  const encodedEncryptedPayload = bs58.encode(encryptedPayload);

  return {
    nonce: encodedNonce,
    encryptedPayload: encodedEncryptedPayload,
  };
};
