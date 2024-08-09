import { useState } from 'react';
import {
  Transaction,
  PublicKey,
  Connection,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from '@solana/spl-token';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { db } from '@/firebase/config';
import { query, where, collection, getDocs } from 'firebase/firestore';

interface UseSendTokensProps {
  userId: string;
  senderUserId: string; // ID del usuario emisor
  receiverPublicKey: string; // PublicKey del receptor
}

export const useSendTokens = ({
  userId,
  senderUserId,
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
    const toPublicKey = new PublicKey(receiverPublicKey); // PublicKey del receptor
    const mintPublicKey = new PublicKey(tokenMintAddress);

    const fromTokenAccount = await connection.getParsedTokenAccountsByOwner(
      senderPublicKey,
      { mint: mintPublicKey },
    );

    const toTokenAccount = await connection.getParsedTokenAccountsByOwner(
      toPublicKey,
      { mint: mintPublicKey },
    );

    const fromTokenAddress = fromTokenAccount.value[0].pubkey;
    const toTokenAddress =
      toTokenAccount.value.length > 0
        ? toTokenAccount.value[0].pubkey
        : undefined;

    const transaction = new Transaction();

    if (!toTokenAddress) {
      const associatedTokenAccountInstruction =
        createAssociatedTokenAccountInstruction(
          senderPublicKey, // Payer
          toPublicKey, // Associated token account owner
          mintPublicKey, // Mint
          toPublicKey, // Associated token account
        );
      transaction.add(associatedTokenAccountInstruction);
    }

    const transferInstruction = createTransferInstruction(
      fromTokenAddress,
      toTokenAddress || toPublicKey, // Usar la cuenta de token asociada o la cuenta pública del receptor
      senderPublicKey,
      amount,
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

      // Obtén el documento por senderUserId para session, sharedSecret, y publicKey
      const phantomConnections = await getDocumentByUserId(
        userId,
        'phantomConnections',
      );
      const {
        session,
        sharedSecretDapp,
        publicKey: senderPublicKeyString,
      } = phantomConnections;

      // Asegúrate de que sharedSecret sea un Uint8Array
      const sharedSecret = bs58.decode(sharedSecretDapp);

      // Crear el PublicKey del emisor
      const senderPublicKey = new PublicKey(senderPublicKeyString);

      const transaction = await createUnsignedTransferTransaction(
        senderPublicKey,
        tokenMintAddress,
        amount,
      );

      const serializedTransaction = bs58.encode(
        transaction.serialize({
          requireAllSignatures: false, // No firmar la transacción aquí
        }),
      );

      const payload = {
        session,
        transaction: serializedTransaction,
      };

      const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

      const params = new URLSearchParams({
        dapp_encryption_public_key: senderPublicKeyString,
        nonce: bs58.encode(nonce),
        redirect_link: `https://pambii-front.vercel.app/api/phantom-redirect-sign?userId=${senderUserId}`,
        payload: bs58.encode(encryptedPayload),
      });

      console.log('Sending tokens...');
      const url = buildUrl('signAndSendTransaction', params);

      // Retorna la URL generada
      return url;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return { sendTokens, isSending, error };
};

// Función encryptPayload
const encryptPayload = (payload: any, sharedSecret?: Uint8Array) => {
  if (!sharedSecret) throw new Error('missing shared secret');

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
