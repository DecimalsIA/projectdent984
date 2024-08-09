'use client';

import React, { useEffect, useState } from 'react';
import { useSignTransaction } from '@/hooks/useSignTransaction';
import { useSendTokens } from '@/hooks/useSendTokens';
import { useTelegram } from '@/context/TelegramContext';

const tokenMintAddress = 'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ';
const amount = 10_000_000_000;

const convertToLamports = (amount: number, decimals: number = 9): number => {
  return Math.floor(amount * Math.pow(10, decimals));
};

const SignTransactionPage = () => {
  const { user } = useTelegram();

  // Verificar si user está definido y tiene un id antes de continuar
  const userId = user?.id?.toString() ?? '';

  // Estado para manejar la URL generada y el proceso de firma
  const [url, setUrl] = useState<string | null>(null);
  const [urlToken, setUrlToken] = useState<string | null>(null);

  // Solo ejecuta el hook si userId está disponible
  const { signTransaction, error } = useSignTransaction({ userId });
  const { sendTokens } = useSendTokens({
    userId,
    senderUserId: 'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3',
    receiverPublicKey: '9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y',
  });

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    const initiateTransaction = async () => {
      try {
        const generatedUrl = await signTransaction();
        const transactionUrl = await sendTokens(
          tokenMintAddress,
          convertToLamports(10),
        );
        setUrl(generatedUrl);
        setUrlToken(transactionUrl);
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
      ) : url && urlToken ? (
        <>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Sign Transaction with Phantom
          </a>

          <br />

          <a href={urlToken} target="_blank" rel="noopener noreferrer">
            Sign Token PAMBII
          </a>
        </>
      ) : (
        <p>Generating transaction signing URL...</p>
      )}
    </div>
  );
};

export default SignTransactionPage;
