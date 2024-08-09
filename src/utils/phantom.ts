import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { buildTransaction } from './sc';
import { getDappKeyPair, getDocumentByUserId } from './getDocumentByUserId';
import { encryptPayload } from './encryptPayload';
import { buildUrl } from './buildUrl';
import { getAssociatedTokenAddress } from '@solana/spl-token';

export async function generatePhantomDeeplink(
  userId: string,
  type?: string,
): Promise<string> {
  // Obtener los datos necesarios desde Firestore u otro origen de datos
  const {
    session,
    sharedSecretDapp,
    publicKey: publicKeyString,
  } = await getDocumentByUserId(userId);

  const publicKey = new PublicKey(publicKeyString);
  const sharedSecret = bs58.decode(sharedSecretDapp);
  console.log('sharedSecret', sharedSecret);

  // Dirección del SPL Token específico
  const splToken = new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ');

  // Obtener la clave pública del DApp desde Firestore
  const dappKeyPairDocument = await getDappKeyPair(userId);
  const dappKeyPair = {
    publicKey: bs58.decode(dappKeyPairDocument.publicKey),
  };

  // Obtener la cuenta asociada del token SPL del usuario
  const userToken = await getAssociatedTokenAddress(splToken, publicKey);
  const contractToken = await getAssociatedTokenAddress(splToken, new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe'));

  // Configurar las cuentas necesarias para la transacción
  const accounts = {
    userToken, // Cuenta asociada del token SPL del usuario
    contractToken, // Dirección del contrato
    amount: 100, // Ajusta según tus necesidades
  };

  // Construir la transacción sin firmarla
  const transaction = await buildTransaction(publicKey, 'buy', accounts);

  // Serializar la transacción
  const serializedTransaction = bs58.encode(
    transaction.serialize({
      requireAllSignatures: false,
    }),
  );

  // Crear el payload para Phantom
  const payload = {
    session,
    transaction: serializedTransaction,
  };

  // Encriptar el payload
  const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

  // Configurar los parámetros para el deeplink
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    nonce: bs58.encode(nonce),
    redirect_link: `https://pambii-front.vercel.app/api/phantom-redirect-sing?userId=${userId}`,
    payload: bs58.encode(encryptedPayload),
  });

  // Construir y devolver el URL del deeplink para Phantom Wallet
  return buildUrl('signAndSendTransaction', params);
}
