'use client';

import React, { useEffect, useState } from 'react';
import { useSignTransaction } from '@/hooks/useSignTransaction';
import { useSendTokens } from '@/hooks/useSendTokens';
import { useTelegram } from '@/context/TelegramContext';
import { useSC } from '@/hooks/useSC';

const SignTransactionPage = () => {
  const { user } = useTelegram();
  const { getPhantomUrl } = useSC();

  // Verificar si user está definido y tiene un id antes de continuar
  const userId = user?.id?.toString() ?? '792924145';

  console.log('userId', userId);

  // Estado para manejar la URL generada y el proceso de firma
  const [url, setUrl] = useState<string | null>(null);
  const [phantomUrl, setPhantomUrl] = useState<string>('');

  // Solo ejecuta el hook si userId está disponible
  const { signTransaction, error } = useSignTransaction({ userId });
  const { sendTokens } = useSendTokens({
    userId,
    receiverPublicKey: '9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y',
  });

  useEffect(() => {
    const generateUrl = async () => {
      const url = await getPhantomUrl(userId);

      setPhantomUrl(url);

      console.log('Transaction getPhantomUrl:', url);
    };

    generateUrl();
  }, [userId, getPhantomUrl]);

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
      } catch (err) {
        console.error('Error signing transaction:', err);
      }
    };

    initiateTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Sign Transaction with Phantom Wallet</h1>
      {!userId ? (
        <p>Error: User ID is not available</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : url && phantomUrl ? (
        <>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Sign Transaction with Phantom
          </a>

          <br />

          <a href={phantomUrl} target="_blank" rel="noopener noreferrer">
            Send firm
          </a>
          <br />
        </>
      ) : (
        <p>Generating transaction signing URL...</p>
      )}
    </div>
  );
};

export default SignTransactionPage;
