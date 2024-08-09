import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { buildTransaction } from './sc';
import { getDappKeyPair, getDocumentByUserId } from './getDocumentByUserId';
import { encryptPayload } from './encryptPayload';
import { buildUrl } from './buildUrl';
import { getAssociatedTokenAddress } from '@solana/spl-token';

export async function generatePhantomDeeplink(
  userId: string,
  type: 'buy' | 'cobrar' | 'withdrawAll' = 'buy', // Tipo de transacción predeterminado a 'buy'
): Promise<string> {
  // Obtener los datos necesarios desde Firestore u otro origen de datos
  const { session, sharedSecretDapp, publicKey: publicKeyString } = await getDocumentByUserId(userId);
  const connection = new Connection(clusterApiUrl("devnet"));


  if (!session || !sharedSecretDapp || !publicKeyString) {
    throw new Error('Datos insuficientes para generar el deeplink');
  }

  const publicKey = new PublicKey(publicKeyString);
  const sharedSecret = bs58.decode(sharedSecretDapp);


  // Dirección del SPL Token específico
  const splToken = new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ');

  // Dirección del smart contract
  const smc = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe');

  // Obtener la clave pública del DApp desde Firestore
  const dappKeyPairDocument = await getDappKeyPair(userId);

  if (!dappKeyPairDocument?.publicKey) {
    throw new Error('No se pudo obtener la clave pública del DApp');
  }

  const dappKeyPair = {
    publicKey: bs58.decode(dappKeyPairDocument.publicKey),
  };

  // Obtener la cuenta asociada del token SPL del usuario
  const userToken = await getAssociatedTokenAddress(splToken, publicKey);
  const contractToken = await getAssociatedTokenAddress(splToken, smc);

  // Configurar las cuentas necesarias para la transacción
  const accounts = {
    userToken,     // Cuenta asociada del token SPL del usuario
    contractToken, // Cuenta del token SPL del contrato
    amount: 100,   // Cantidad ajustada según las necesidades
  };

  // Construir la transacción sin firmarla
  const transaction = await buildTransaction(publicKey, type, accounts);
  transaction.feePayer = publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  // Serializar la transacción
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });


  // Crear el payload para Phantom
  const payload = {
    session,
    transaction: bs58.encode(serializedTransaction),
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
