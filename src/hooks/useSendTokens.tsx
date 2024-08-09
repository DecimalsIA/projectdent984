import { useState } from 'react';
import {
  Transaction,
  PublicKey,
  Connection,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from '@solana/spl-token';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { db } from '@/firebase/config';
import { query, where, collection, getDocs } from 'firebase/firestore';

interface UseSendTokensProps {
  userId: string; // userId como prop
}

export const useSendTokens = ({ userId }: UseSendTokensProps) => {
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

  const getDappKeyPair = async () => {
    try {
      const q = query(
        collection(db, 'dappKeyPairs'),
        where('userId', '==', userId),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data(); // Retorna el primer documento que coincide con el filtro
      } else {
        throw new Error('No dappKeyPair found for the given userId');
      }
    } catch (error) {
      console.error('Error getting dappKeyPair: ', error);
      throw error;
    }
  };

  const createTransferTransaction = async (
    publicKey: PublicKey,
    tokenMintAddress: string,
    amount: number,
  ) => {
    const toPublicKey = new PublicKey(
      '9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y',
    );
    const mintPublicKey = new PublicKey(tokenMintAddress);

    // Obtener la cuenta asociada del token del receptor
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      publicKey, // Fee payer
      mintPublicKey, // Token Mint
      toPublicKey, // Recipient
    );

    // Obtener la cuenta asociada del token del emisor
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      publicKey, // Fee payer and owner
      mintPublicKey, // Token Mint
      publicKey, // Owner (sender)
    );

    // Crear la instrucción de transferencia de tokens SPL
    const transaction = new Transaction().add(
      transfer(
        fromTokenAccount.address, // Desde la cuenta del emisor
        toTokenAccount.address, // Hacia la cuenta del receptor
        publicKey, // El propietario de la cuenta desde la que se transfieren los tokens
        amount, // Cantidad de tokens a transferir
        [], // Multisig (si aplica, normalmente se deja vacío)
        TOKEN_PROGRAM_ID, // ID del programa de tokens SPL
      ),
    );

    // Asignar el fee payer
    transaction.feePayer = publicKey;

    console.log('Getting recent blockhash');
    const anyTransaction: any = transaction;
    anyTransaction.recentBlockhash = (
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

      // Obtén el documento por userId para session, sharedSecret, y publicKey
      const phantomConnections = await getDocumentByUserId(
        userId,
        'phantomConnections',
      );
      const {
        session,
        sharedSecretDapp,
        publicKey: publicKeyString,
      } = phantomConnections;
      const publicKey = new PublicKey(publicKeyString);
      console.log('sharedSecretDapp', sharedSecretDapp);

      // Asegúrate de que sharedSecret sea un Uint8Array
      const sharedSecret = bs58.decode(sharedSecretDapp);
      console.log('sharedSecret', sharedSecret);

      // Obtén dappKeyPair desde otro documento y asegúrate de que la clave pública esté en Uint8Array
      const dappKeyPairDocument = await getDappKeyPair();
      const dappKeyPair = {
        publicKey: bs58.decode(dappKeyPairDocument.publicKey),
      };

      const transaction = await createTransferTransaction(
        publicKey,
        tokenMintAddress,
        amount,
      );

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

// Función encryptPayload ya proporcionada
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

// Función buildUrl actualizada
const buildUrl = (path: string, params: URLSearchParams) =>
  `https://phantom.app/ul/v1/${path}?${params.toString()}`;
