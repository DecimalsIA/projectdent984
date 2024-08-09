import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { buildTransaction } from './sc';
import { getDappKeyPair, getDocumentByUserId } from './getDocumentByUserId';
import { encryptPayload } from './encryptPayload';
import { buildUrl } from './buildUrl';


export async function generatePhantomDeeplink(
  userId: string,
  type?: string,
): Promise<string> {

  const {
    session,
    sharedSecretDapp,
    publicKey: publicKeyString,
  } = await getDocumentByUserId(userId);

  const publicKey = new PublicKey(publicKeyString);

  // Cambiado a buildTransaction para no firmar la transacción
  const transaction = await buildTransaction(publicKey, 'buyId', {
    userAccount: null, // O los parámetros necesarios para construir la instrucción
    amount: 1, // Ajusta según tus necesidades
  });

  // Serializa la transacción para el deeplink
  const serializedTransaction = bs58.encode(transaction.serializeMessage());

  // Generar un nonce
  const payload = {
    session,
    transaction: serializedTransaction,
  };
  const sharedSecret = bs58.decode(sharedSecretDapp);

  const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
  const dappKeyPairDocument = await getDappKeyPair(userId);
  const dappKeyPair = {
    publicKey: bs58.decode(dappKeyPairDocument.publicKey),
  };

  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    nonce: bs58.encode(nonce),
    redirect_link: `https://pambii-front.vercel.app/api/phantom-redirect-sing?userId=${userId}`,
    payload: bs58.encode(encryptedPayload),
  });

  return buildUrl('signAndSendTransaction', params);
}
