import { useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { db } from '@/firebase/config';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

const usePhantomConnect = (userId: string, walletAddress: string) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePhantomConnectUrl = async () => {
      try {
        let dappKeyPair;

        // Obtener o crear un par de claves para el usuario
        const keyPairDocRef = doc(db, 'dappKeyPairs', userId);
        const docSnap = await getDoc(keyPairDocRef);

        if (docSnap.exists()) {
          const storedKeyPair = docSnap.data();
          dappKeyPair = {
            publicKey: bs58.decode(storedKeyPair.publicKey),
            secretKey: bs58.decode(storedKeyPair.secretKey),
          };
        } else {
          // Generar un nuevo par de claves y guardarlo en Firestore
          dappKeyPair = nacl.box.keyPair();
          await setDoc(keyPairDocRef, {
            publicKey: bs58.encode(dappKeyPair.publicKey),
            secretKey: bs58.encode(dappKeyPair.secretKey),
            userId,
            walletAddress,
          });
        }

        const appUrl = 'https://pambii-front.vercel.app'; // URL de tu aplicación
        const redirectLink = `https://pambii-front.vercel.app/api/phantom-redirect?walletAddress=${walletAddress}&userId=${userId}`; // Añadir la dirección de la billetera a la URL de redirección
        const cluster = 'devnet'; // o 'testnet', 'devnet'

        const publicKey = bs58.encode(dappKeyPair.publicKey);

        const params = new URLSearchParams({
          app_url: appUrl,
          dapp_encryption_public_key: publicKey,
          redirect_link: redirectLink,
          cluster,
        });

        const phantomUrl = `https://phantom.app/ul/v1/connect?${params.toString()}`;

        setUrl(phantomUrl);
      } catch (err) {
        setError('Failed to generate Phantom connect URL');
        console.error(err);
      }
    };

    generatePhantomConnectUrl();
  }, [userId, walletAddress]);

  return { url, error };
};

export default usePhantomConnect;
