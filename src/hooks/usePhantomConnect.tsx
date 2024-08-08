import { useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const usePhantomConnect = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dappKeyPair] = useState(() => nacl.box.keyPair());

  useEffect(() => {
    const generatePhantomConnectUrl = async () => {
      try {
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
  }, [dappKeyPair]);

  return { url, error };
};

export default usePhantomConnect;
