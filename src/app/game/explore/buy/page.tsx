'use client';
import { useState } from 'react';
import axios from 'axios';
import { ButtonPambii } from 'pambii-devtrader-front';
import usePhantomConnect from '@/hooks/usePhantomConnect';

const Home = () => {
  const [deeplink, setDeeplink] = useState('');
  const { url, error } = usePhantomConnect('pZzrHeGsqrGOhwI4CpYh');

  const handleGenerateDeeplink = async () => {
    try {
      const response = await axios.get('/api/generate-transaction', {
        params: {
          programId: 'AceRYkKX6mWc8TtkaCevPhDpjjMBEode75Kn59XtTdVX',
          baseAccount: '9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y', // Obtén esto después de inicializar la cuenta en Anchor
          user: 'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3', // Obtén esto cuando el usuario conecte su billetera
          newValue: 42, // Valor a establecer
        },
      });

      const transaction = response.data.transaction;

      const appUrl = 'https://pambii-front.vercel.app/game/explore/buy';
      const redirectUrl = 'https://pambii-front.vercel.app/game/explore/buy';
      const dappPublicKey = 'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3'; // Puede ser la misma que la del usuario

      const deeplink = `https://phantom.app/ul/v1/signTransaction?dapp_encryption_public_key=${dappPublicKey}&cluster=devnet&app_url=${appUrl}&redirect_url=${redirectUrl}&transaction=${transaction}`;
      console.log('deeplink', deeplink);
      setDeeplink(deeplink);
    } catch (error) {
      console.error('Error generating deeplink:', error);
    }
  };

  return (
    <div>
      <h1>Generar Deeplink para Solana</h1>
      <ButtonPambii onClick={handleGenerateDeeplink}>
        Generar Deeplinks
      </ButtonPambii>
      {url && (
        <div>
          <p>Deeplink generado:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <ButtonPambii> Firmar en Phamton </ButtonPambii>
          </a>
          <br />
        </div>
      )}
    </div>
  );
};

export default Home;
