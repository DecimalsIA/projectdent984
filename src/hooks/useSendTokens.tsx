import { useState } from 'react';
import {
  Transaction,
  PublicKey,
  Connection,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getMint,
  createTransferCheckedInstruction,
} from '@solana/spl-token';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { db } from '@/firebase/config';
import { query, where, collection, getDocs } from 'firebase/firestore';

interface UseSendTokensProps {
  userId: string;
  receiverPublicKey: string; // PublicKey del receptor
}

export const useSendTokens = ({
  userId,
  receiverPublicKey,
}: UseSendTokensProps) => {
  const connection = new Connection(clusterApiUrl('devnet'));
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDocumentByUserId = async (
    userId: string,
    collectionName: string,
  ) => {
    try {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data(); // Retorna el primer documento que coincide con el filtro
      } else {
        throw new Error('No document found for the given userId');
      }
    } catch (error) {
      console.error('Error getting document: ', error);
      throw error;
    }
  };

  const createUnsignedTransferTransaction = async (
    senderPublicKey: PublicKey, // PublicKey del emisor
    tokenMintAddress: string,
    amount: number,
  ) => {
    const mintPublicKey = new PublicKey(tokenMintAddress);
    const toPublicKey = new PublicKey(receiverPublicKey); // PublicKey del receptor

    // Obtener la cuenta de token asociada del emisor
    const fromTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      senderPublicKey,
    );

    // Obtener la cuenta de token asociada del receptor
    const toTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      toPublicKey,
    );

    // Verificar que el mint es válido y obtener información de decimales
    const mintInfo = await getMint(connection, mintPublicKey);
    if (!mintInfo.isInitialized) {
      throw new Error('Token mint is not initialized');
    }

    const transaction = new Transaction();

    // Crear instrucción de transferencia con verificación adicional
    const transferInstruction = createTransferCheckedInstruction(
      fromTokenAccount,
      mintPublicKey, // Dirección del mint del token
      toTokenAccount,
      senderPublicKey,
      amount,
      mintInfo.decimals, // Decimales del mint para verificación
      [],
      TOKEN_PROGRAM_ID,
    );

    transaction.add(transferInstruction);

    transaction.feePayer = senderPublicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    return transaction;
  };

  const sendTokens = async (
    tokenMintAddress: string,
    amount: number,
  ): Promise<string> => {
    try {
      setIsSending(true);
      setError(null);

      console.log('Preparing to send tokens...');
      console.log('Token Mint Address:', tokenMintAddress);

      // Obtén el documento por senderUserId para session, sharedSecret, y publicKey del emisor
      const phantomConnections = await getDocumentByUserId(
        userId,
        'phantomConnections',
      );
      if (!phantomConnections) {
        throw new Error('Sender not found in phantomConnections');
      }

      const {
        session,
        sharedSecretDapp,
        publicKey: senderPublicKeyString,
      } = phantomConnections;

      // Asegúrate de que sharedSecret sea un Uint8Array
      const sharedSecret = bs58.decode(sharedSecretDapp);
      if (!sharedSecret) {
        throw new Error('Invalid shared secret');
      }

      // Crear el PublicKey del emisor
      const senderPublicKey = new PublicKey(senderPublicKeyString);

      const transaction = await createUnsignedTransferTransaction(
        senderPublicKey,
        tokenMintAddress,
        amount,
      );

      // Serializar la transacción para enviarla sin firma
      const serializedTransaction = bs58.encode(
        transaction.serialize({
          requireAllSignatures: false, // No firmar la transacción aquí
        }),
      );

      const payload = {
        transaction: serializedTransaction,
        session,
      };

      // Encriptar el payload usando nacl
      const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

      // Construir el payload final con `cipherText` y `nonce`
      const finalPayload = {
        cipherText: bs58.encode(encryptedPayload),
        nonce: bs58.encode(nonce),
      };

      const params = new URLSearchParams({
        dapp_encryption_public_key: senderPublicKeyString,
        ...finalPayload,
        redirect_link: `https://pambii-front.vercel.app/api/phantom-redirect-sign?userId=${userId}`,
      });

      console.log('Sending tokens...');
      const url = buildUrl('signAndSendTransaction', params);

      // Retorna la URL generada
      return url;
    } catch (err: any) {
      setError(err.message);
      console.error('Error sending tokens:', err);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return { sendTokens, isSending, error };
};

const encryptPayload = (payload: any, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) throw new Error('Missing shared secret');

  const nonce = nacl.randomBytes(24);

  const encryptedPayload = nacl.box.after(
    Buffer.from(JSON.stringify(payload)),
    nonce,
    sharedSecret,
  );

  return [nonce, encryptedPayload];
};

// Función buildUrl
const buildUrl = (path: string, params: URLSearchParams) =>
  `https://phantom.app/ul/v1/${path}?${params.toString()}`;
