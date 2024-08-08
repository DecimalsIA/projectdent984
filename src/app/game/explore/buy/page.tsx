import { useState } from 'react';
import { createDeeplink } from '../../../../utils/solana';

const Home = () => {
  const [deeplink, setDeeplink] = useState('');

  const handleGenerateDeeplink = async () => {
    const programId = 'AceRYkKX6mWc8TtkaCevPhDpjjMBEode75Kn59XtTdVX';
    const baseAccount = '9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y';
    const user = 'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3';
    const newValue = 42; // Valor a establecer
    const dappPublicKey = user;
    const appUrl = 'https://pambii-front.vercel.app/game/explore/buy';
    const redirectUrl = 'https://pambii-front.vercel.app/game/explore/buy';

    const link = await createDeeplink(
      programId,
      baseAccount,
      user,
      newValue,
      dappPublicKey,
      appUrl,
      redirectUrl,
    );
    setDeeplink(link);
  };

  return (
    <div>
      <h1>Generar Deeplink para Solana</h1>
      <button onClick={handleGenerateDeeplink}>Generar Deeplink</button>
      {deeplink && (
        <div>
          <p>Deeplink generado:</p>
          <a href={deeplink} target="_blank" rel="noopener noreferrer">
            {deeplink}
          </a>
        </div>
      )}
    </div>
  );
};

export default Home;
