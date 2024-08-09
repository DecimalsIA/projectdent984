import { useState } from 'react';
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { db } from '@/firebase/config';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { Idl, Program, AnchorProvider } from '@project-serum/anchor';

interface UseExecuteContractProps {
  userId: string;
}

export const useExecuteContract = ({ userId }: UseExecuteContractProps) => {
  const connection = new Connection(clusterApiUrl('devnet'));
  const [isExecuting, setIsExecuting] = useState(false);
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
        return querySnapshot.docs[0].data();
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
        return querySnapshot.docs[0].data();
      } else {
        throw new Error('No dappKeyPair found for the given userId');
      }
    } catch (error) {
      console.error('Error getting dappKeyPair: ', error);
      throw error;
    }
  };

  const executeContract = async (
    idl: Idl, // IDL del programa
    programId: PublicKey,
    methodName: string,
    params: any[], // Parámetros del método
    additionalKeys: Array<{
      pubkey: PublicKey;
      isSigner: boolean;
      isWritable: boolean;
    }> = [],
  ): Promise<string> => {
    try {
      setIsExecuting(true);
      setError(null);

      const phantomConnections = await getDocumentByUserId(
        userId,
        'phantomConnections',
      );
      const {
        session,
        sharedSecretDapp,
        publicKey: publicKeyString,
      } = phantomConnections;
      const userPublicKey = new PublicKey(publicKeyString);

      const sharedSecret = bs58.decode(sharedSecretDapp);

      const dappKeyPairDocument = await getDappKeyPair();
      const dappKeyPair = {
        publicKey: bs58.decode(dappKeyPairDocument.publicKey),
      };

      const provider = new AnchorProvider(
        connection,
        { publicKey: userPublicKey },
        AnchorProvider.defaultOptions(),
      );
      const program = new Program(idl, programId, provider);

      // Construye la instrucción usando el IDL y el nombre del método
      const instruction = await program.methods[methodName](...params)
        .accounts({
          // Aquí puedes mapear las cuentas requeridas según el IDL del programa
        })
        .signers([])
        .instruction();

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = userPublicKey;

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

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

      const paramsUrl = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
        nonce: bs58.encode(nonce),
        redirect_link: `https://pambii-front.vercel.app/api/phantom-redirect-sing?userId=${userId}`,
        payload: bs58.encode(encryptedPayload),
      });

      console.log('Executing contract...');
      const url = buildUrl('signAndSendTransaction', paramsUrl);

      return url;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  };

  return { executeContract, isExecuting, error };
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
