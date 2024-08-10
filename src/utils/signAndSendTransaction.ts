import bs58 from "bs58";
import { encryptPayload } from "./encryptPayload";
import { buildUrl } from "./buildUrl";
import {
  getDappKeyPair,
  getDocumentByUserId,
} from '@/utils/getDocumentByUserId';
import { PublicKey, Transaction } from "@solana/web3.js";

export const signAndSendTransaction = async (
  userId: string,
  transactionParams: Transaction // Parámetros opcionales que se pasarán a la función de transacción
) => {

  const {
    session,
    sharedSecretDapp
  } = await getDocumentByUserId(userId);


  // Obtener el par de claves del dapp
  const dappKeyPairDocument = await getDappKeyPair(userId);
  const dappKeyPair = {
    publicKey: bs58.decode(dappKeyPairDocument.publicKey),
  };



  // Crear la transacción
  const transaction = transactionParams;

  // Serializar la transacción
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });

  // Preparar el payload para el deeplink
  const payload = {
    session,
    transaction: bs58.encode(serializedTransaction),
  };
  const sharedSecret = bs58.decode(sharedSecretDapp);
  const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

  // Construir el URL para el deeplink
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    nonce: bs58.encode(nonce),
    redirect_link: '',
    payload: bs58.encode(encryptedPayload),
  });
  const url = buildUrl("signAndSendTransaction", params);
  return url;
};
