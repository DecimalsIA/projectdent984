/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import { useSignTransaction } from '@/hooks/useSignTransaction';
import { useSendTokens } from '@/hooks/useSendTokens';
import { useTelegram } from '@/context/TelegramContext';

import { useSendSol } from '@/hooks/useSendSol';
import TransactionComponent from '@/components/TransactionComponent';

const SignTransactionPage = () => {
  const { user } = useTelegram();

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
      const udlSOl = await getSendSolUrl(userId, sendingSOL);

      setSendSol(udlSOl);
    };

    generateUrl();
  }, [userId]);

  return (
    <div>
      <hr />
      <h1>Sign Transaction with Phantom Wallet</h1>
      <hr />
      <br />
      <br />
      {!userId ? (
        <p> User ID is not available</p>
      ) : (
        <>
          {' '}
          <hr />
          <div>
            1999 : <TransactionComponent />
          </div>
        </>
      )}
    </div>
  );
};

export default SignTransactionPage;
