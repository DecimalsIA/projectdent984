/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React from 'react';

import { useTelegram } from '@/context/TelegramContext';
import TransactionComponent from '@/components/TransactionComponent';

const SignTransactionPage = () => {
  const { user } = useTelegram();

  const userId = user?.id?.toString() ?? '792924145';

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
            1999 : <TransactionComponent spl={100} userid={userId} />
          </div>
        </>
      )}
    </div>
  );
};

export default SignTransactionPage;
