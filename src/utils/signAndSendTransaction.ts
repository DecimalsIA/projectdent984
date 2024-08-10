import bs58 from "bs58";
import { encryptPayload } from "./encryptPayload";
import { buildUrl } from "./buildUrl";
import {
  getDappKeyPair,
  getDocumentByUserId,
} from '@/utils/getDocumentByUserId';
import { PublicKey } from "@solana/web3.js";

export const signAndSendTransaction = async (
  userId: string,
  functionTransaction: Function,
  transactionParams?: any // Parámetros opcionales que se pasarán a la función de transacción
) => {
  // Obtener los datos del usuario
  const {
    session,
    sharedSecretDapp,
    publicKey: fromPublicKeyString,
  } = await getDocumentByUserId(userId);
  const fromPublicKey = new PublicKey(fromPublicKeyString);

  // Obtener el par de claves del dapp
  const dappKeyPairDocument = await getDappKeyPair(userId);
  const dappKeyPair = {
    publicKey: bs58.decode(dappKeyPairDocument.publicKey),
  };

  // Incluir fromPubkey en los parámetros de transacción
  if (transactionParams) {
    transactionParams.fromPubkey = fromPublicKey;
  } else {
    transactionParams = { fromPubkey: fromPublicKey };
  }

  // Crear la transacción
  const transaction = await functionTransaction(transactionParams);

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
