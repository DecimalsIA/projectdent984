import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import usePhantomDeeplink from '../hooks/usePhantomDeeplink';
import { buildTransaction } from '../utils/buildTransaction';

const TransactionComponent: React.FC = () => {
  const { deeplink, generateDeeplink } = usePhantomDeeplink();
  const [transaction, setTransaction] = useState<string | null>(null);
  const [deeplinkGenerated, setDeeplinkGenerated] = useState(false);

  // Este useEffect solo se ejecutará una vez cuando el componente se monte
  useEffect(() => {
    const createTransaction = async () => {
      const connection = new Connection('https://api.devnet.solana.com');

      const senderPublicKey = new PublicKey(
        'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3',
      );
      const tokenMintAddress = new PublicKey(
        'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ',
      );
      const contractPublicKey = new PublicKey(
        '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe',
      );
      const programId = new PublicKey(
        '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe',
      );
      const amount = 1000000; // Cantidad de tokens SPL (en la mínima unidad)

      const serializedTransaction = await buildTransaction(
        senderPublicKey,
        tokenMintAddress,
        contractPublicKey,
        amount,
        connection,
        programId,
      );

      setTransaction(serializedTransaction);
    };

    createTransaction();
  }, []); // Dependencia vacía para asegurar que solo se ejecute una vez

  // Este useEffect se ejecutará solo cuando `transaction` cambie y si el deeplink no ha sido generado
  useEffect(() => {
    if (transaction && !deeplinkGenerated) {
      const session =
        '43WSmevaVx8o4uHt7ZByrtqdJYFHSuB6TY2ZhG8SBDRBBt6p898RXW3uP1i895kiscfFHioQhPzYC3ZMZzy6ojrNRsB1rRfhg2YWA9XceW4qVU5wqmcFuD7MEhuViZdozmRjfirjVUn8ySgA2tzWDgiXbQJ2RPdxZK2kU5ehcUSzRnMJfYh8rcWjrXQU6rcjnPxj3aHwvd3NkM9dwaAWXvwUHvuzHrfyFDcZrWT9Fr';
      const redirectLink =
        'https://pambii-front.vercel.app/api/phantom-redirect';
      const dappEncryptionPublicKey =
        'GrLco62VByQdt4x6xPC2vtBrtgFVpKSQ6zvuAK1r9SWC';

      generateDeeplink({
        transaction,
        session,
        redirectLink,
        dappEncryptionPublicKey,
        sharedSecret: '6vQjBJohpaDAt3ajDfdsaGzTTWrHAUbrCfRkrWDntWMJ',
      });

      setDeeplinkGenerated(true); // Marca que el deeplink ha sido generado
    }
  }, [transaction, deeplinkGenerated]); // Solo se ejecuta cuando `transaction` cambia y el deeplink no ha sido generado

  return (
    <div>
      {deeplink ? (
        <a href={deeplink} target="_blank" rel="noopener noreferrer">
          Firmar en Phantom
        </a>
      ) : (
        <p>Generando deeplink...</p>
      )}
    </div>
  );
};

export default TransactionComponent;
