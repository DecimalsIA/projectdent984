/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import { useSignTransaction } from '@/hooks/useSignTransaction';
import { useSendTokens } from '@/hooks/useSendTokens';
import { useTelegram } from '@/context/TelegramContext';
import { useSC } from '@/hooks/useSC';
import { useSendSol } from '@/hooks/useSendSol';

const SignTransactionPage = () => {
  const { user } = useTelegram();
  const { getPhantomUrl } = useSC();
  const { getSendSolUrl } = useSendSol();

  // Verificar si user está definido y tiene un id antes de continuar
  const userId = user?.id?.toString() ?? '792924145';

  console.log('userId', userId);

  // Estado para manejar la URL generada y el proceso de firma
  const [phantomUrl, setPhantomUrl] = useState<string>('');
  const [sendSolurl, setSendSol] = useState<string>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendingSOL = {
    to: '9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y',
    lamports: 1000,
  };

  useEffect(() => {
    if (!userId) return;
    const generateUrl = async () => {
      const url = await getPhantomUrl(userId);
      const udlSOl = await getSendSolUrl(userId, sendingSOL);
      setPhantomUrl(url);
      setSendSol(udlSOl);
    };

    generateUrl();
  }, [userId]);

  return (
    <div>
      <h1>Sign Transaction with Phantom Wallet</h1>
      {!userId ? (
        <p> User ID is not available</p>
      ) : sendSolurl && phantomUrl ? (
        <>
          <a href={phantomUrl} target="_blank" rel="noopener noreferrer">
            Sign Transaction with Phantom
          </a>

          <br />

          <a href={sendSolurl} target="_blank" rel="noopener noreferrer">
            sendSolurl
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
