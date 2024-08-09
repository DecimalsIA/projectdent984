'use client';
import { useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { db } from '@/firebase/config';
import {
  doc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
} from 'firebase/firestore';

const usePhantomSignTransaction = (
  userId: string,
  programId: string,
  baseAccount: string,
  user: string,
  newValue: number,
  redirectLink: string,
) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const generatePhantomSignTransactionUrl = async () => {
      try {
        // 1. Recuperar dappKeyPair desde Firebase
        const keyPairDocRef = doc(db, 'dappKeyPairs', userId);
        const docSnap = await getDoc(keyPairDocRef);

        if (!docSnap.exists()) {
          throw new Error('dappKeyPair not found');
        }

        const storedKeyPair = docSnap.data();
        const dappKeyPair = {
          publicKey: bs58.decode(storedKeyPair.publicKey),
          secretKey: bs58.decode(storedKeyPair.secretKey),
        };

        // 2. Recuperar la sesión desde Firebase
        const sessionQuery = query(
          collection(db, 'phantomConnections'),
          where('userId', '==', userId),
        );
        const sessionDocs = await getDocs(sessionQuery);

        if (sessionDocs.empty) {
          throw new Error('No session found for this user');
        }

        const sessionDoc = sessionDocs.docs[0];
        const sessionData = sessionDoc.data();
        const session = sessionData.session;

        // 3. Generar la transacción codificada en base58
        const response = await fetch(
          `/api/generate-transaction?programId=${programId}&baseAccount=${baseAccount}&user=${user}&newValue=${newValue}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate transaction');
        }

        const transaction = data.transaction; // Transacción codificada en base58

        // 4. Generar un nonce y cifrar el payload
        const nonce = nacl.randomBytes(nacl.box.nonceLength);
        const nonceBase58 = bs58.encode(nonce);

        const payload = {
          transaction: transaction,
          session: session,
        };
        const payloadString = JSON.stringify(payload);

        // 5. Cifrar el payload usando `nacl.box.after` y el `sharedSecret`
        const sharedSecret = nacl.box.before(
          dappKeyPair.publicKey,
          dappKeyPair.secretKey,
        );
        const encryptedPayload = nacl.box.after(
          new TextEncoder().encode(payloadString),
          nonce,
          sharedSecret,
        );
        const encryptedPayloadBase58 = bs58.encode(encryptedPayload);

        // 6. Construir la URL de Phantom
        const params = new URLSearchParams({
          dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
          nonce: nonceBase58,
          redirect_link: redirectLink,
          payload: encryptedPayloadBase58,
        });

        const phantomUrl = `https://phantom.app/ul/v1/signTransaction?${params.toString()}`;

        setUrl(phantomUrl);
      } catch (err: any) {
        setError(
          err.message || 'Failed to generate Phantom sign transaction URL',
        );
        console.error(err);
      }
    };

    generatePhantomSignTransactionUrl();
  }, [userId, programId, baseAccount, user, newValue, redirectLink]);

  return { url, error };
};

export default usePhantomSignTransaction;
