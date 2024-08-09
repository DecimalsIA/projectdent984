'use client';

import React, { useEffect, useState } from 'react';
import { useSignTransaction } from '@/hooks/useSignTransaction';
import { useTelegram } from '@/context/TelegramContext';

const SignTransactionPage = () => {
  const { user } = useTelegram();

  // Verificar si user está definido y tiene un id antes de continuar
  const userId = user?.id?.toString() ?? '792924145';

  // Estado para manejar la URL generada y el proceso de firma
  const [url, setUrl] = useState<string | null>(null);

  // Solo ejecuta el hook si userId está disponible
  const { signTransaction, error } = useSignTransaction({ userId });

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    const initiateTransaction = async () => {
      try {
        const generatedUrl = await signTransaction();
        setUrl(generatedUrl);
        console.log('Transaction URL:', generatedUrl);
        // window.location.href = generatedUrl; // Redirige automáticamente a la URL generada
      } catch (err) {
        console.error('Error signing transaction:', err);
      }
    };

    initiateTransaction();
  }, []);

  return (
    <div>
      <h1>Sign Transaction with Phantom Wallet</h1>
      {!userId ? (
        <p>Error: User ID is not available</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Sign Transaction with Phantom
        </a>
      ) : (
        <p>Generating transaction signing URL...</p>
      )}
    </div>
  );
};

export default SignTransactionPage;
