import { useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { db } from '@/firebase/config'; // Asegúrate de que esta ruta sea correcta
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';

const usePhantomConnect = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePhantomConnectUrl = async () => {
      try {
        let dappKeyPair;

        // Obtener o crear un par de claves
        const keyPairDocRef = doc(
          collection(db, 'dappKeyPairs'),
          'defaultKeyPair',
        );
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
          await addDoc(collection(db, 'dappKeyPairs'), {
            publicKey: bs58.encode(dappKeyPair.publicKey),
            secretKey: bs58.encode(dappKeyPair.secretKey),
          });
        }

        const appUrl = 'https://pambii-front.vercel.app'; // URL de tu aplicación
        const redirectLink =
          'https://pambii-front.vercel.app/api/phantom-redirect'; // URL de tu redirección en Next.js
        const cluster = 'mainnet-beta'; // o 'testnet', 'devnet'

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
  }, []);

  return { url, error };
};

export default usePhantomConnect;
