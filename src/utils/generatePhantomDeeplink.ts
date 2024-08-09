import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
// Asegúrate de importar la función correcta
import { getDappKeyPair, getDocumentByUserId } from './getDocumentByUserId';
import { encryptPayload } from './encryptPayload';
import { buildUrl } from './buildUrl';
import { createTransactionByIdle } from './idlsc';
import { getAssociatedTokenAddress } from '@solana/spl-token';

export async function generatePhantomDeeplinkIdle(
  userId: string,
  type: string,
): Promise<string> {

  const {
    session,
    sharedSecretDapp,
    publicKey: publicKeyString,
  } = await getDocumentByUserId(userId);

  const publicKey = new PublicKey(publicKeyString);
  const sharedSecret = bs58.decode(sharedSecretDapp);
  console.log('sharedSecret', sharedSecret);

  const splToken = new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ')

  const dappKeyPairDocument = await getDappKeyPair(userId);
  const dappKeyPair = {
    publicKey: bs58.decode(dappKeyPairDocument.publicKey),
  };
  const userTokenAccount = await getAssociatedTokenAddress(splToken, publicKey);

  if (!userTokenAccount) {
    throw new Error('User token account not found');
  }

  // Cambiado a createTransactionByIdle para construir la transacción
  const accounts = {
    userAccount: new PublicKey(publicKeyString), // Ajusta según tus necesidades
    userToken: userTokenAccount, // Ajusta según tus necesidades
    splToken: splToken, // Ajusta según tus necesidades
    contract: new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe'), // Ajusta según tus necesidades
    tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // Ajusta según tus necesidades
    systemProgram: new PublicKey('11111111111111111111111111111111') // Ajusta según tus necesidades
  };

  const transaction = await createTransactionByIdle(type, [10], publicKey, accounts);

  const serializedTransaction = bs58.encode(
    transaction.serialize({
      requireAllSignatures: false,
    }),
  );

  const payload = {
    session,
    transaction: serializedTransaction,
  };

  const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    nonce: bs58.encode(nonce),
    redirect_link: `https://pambii-front.vercel.app/api/phantom-redirect-sing?userId=${userId}`,
    payload: bs58.encode(encryptedPayload),
  });

  return buildUrl('signAndSendTransaction', params);
}
