import React, { useEffect } from 'react';
import nacl from 'tweetnacl';
import { encodeBase64 } from 'tweetnacl-util';

const PhantomConnect: React.FC = () => {
  useEffect(() => {
    const connectToPhantom = async () => {
      const appUrl = encodeURIComponent('https://pambii-front.vercel.app'); // Reemplaza con la URL de tu aplicación
      const redirectLink = encodeURIComponent(
        'https://pambii-front.vercel.app/api/phantom-redirect',
      ); // Reemplaza con la URL de tu redirección en Next.js
      const cluster = 'devnet'; // o 'testnet', 'devnet'

      // Generar un nuevo par de claves
      const keyPair = nacl.box.keyPair();
      const publicKey = encodeBase64(keyPair.publicKey);

      const dappEncryptionPublicKey = encodeURIComponent(publicKey);

      const url = `https://phantom.app/ul/v1/connect?app_url=${appUrl}&dapp_encryption_public_key=${dappEncryptionPublicKey}&redirect_link=${redirectLink}&cluster=${cluster}`;

      //window.location.href = url;
      window.open(url, '_blank');
    };

    connectToPhantom();
  }, []);

  return <div>Connecting to Phantom...</div>;
};

export default PhantomConnect;
