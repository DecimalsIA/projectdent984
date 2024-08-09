import { useState } from 'react';
import {
  Transaction,
  SystemProgram,
  PublicKey,
  Connection,
} from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { db } from '@/firebase/config';
import { query, where, collection, getDocs } from 'firebase/firestore';

interface UseSignTransactionProps {
  userId: string; // userId como prop
}

export const useSignTransaction = ({ userId }: UseSignTransactionProps) => {
  const connection = new Connection('https://api.devnet.solana.com'); // Corrige la URL de conexión
  const [isSigning, setIsSigning] = useState(false);
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

  const createTransferTransaction = async (publicKey: PublicKey) => {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: publicKey,
        lamports: 100, // Ajusta la cantidad de lamports según sea necesario
      }),
    );

    transaction.feePayer = publicKey;

    console.log('Getting recent blockhash');
    const anyTransaction: any = transaction;
    anyTransaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    return transaction;
  };

  const signTransaction = async (): Promise<string> => {
    try {
      setIsSigning(true);
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
      const sharedSecret = bs58.decode(sharedSecretDapp);
      console.log('sharedSecret', sharedSecret);

      // Obtén dappKeyPair desde otro documento
      const dappKeyPairDocument = await getDappKeyPair();
      const dappKeyPair = { publicKey: dappKeyPairDocument.publicKey };

      const transaction = await createTransferTransaction(publicKey);

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
        redirect_link:
          'hhttps://pambii-front.vercel.app/api/phantom-redirect-sing', // Ajusta según corresponda
        payload: bs58.encode(encryptedPayload),
      });

      console.log('Signing transaction...');
      const url = buildUrl('signTransaction', params);

      // Retorna la URL generada
      return url;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsSigning(false);
    }
  };

  return { signTransaction, isSigning, error };
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
