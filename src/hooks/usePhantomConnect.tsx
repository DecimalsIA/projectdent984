import { useState, useEffect } from 'react';
import nacl from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';

const usePhantomConnect = () => {
  const [urlDeepLink, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const generatePhantomConnectUrl = async () => {
      const appUrl = encodeURIComponent('https://pambii-front.vercel.app'); // Reemplaza con la URL de tu aplicación
      const redirectLink = encodeURIComponent(
        'https://pambii-front.vercel.app/api/phantom-redirect',
      ); // Reemplaza con la URL de tu redirección en Next.js
      const cluster = 'devnet'; // o 'testnet', 'devnet'

      // Generar un nuevo par de claves
      const keyPair = nacl.box.keyPair();
      const publicKey = encodeBase64(keyPair.publicKey);

      const dappEncryptionPublicKey = encodeURIComponent(publicKey);

      const phantomUrl = `https://phantom.app/ul/v1/connect?app_url=${appUrl}&dapp_encryption_public_key=${dappEncryptionPublicKey}&redirect_link=${redirectLink}&cluster=${cluster}`;

      setUrl(phantomUrl);
    };

    generatePhantomConnectUrl();
  }, []);

  return urlDeepLink;
};

export default usePhantomConnect;
