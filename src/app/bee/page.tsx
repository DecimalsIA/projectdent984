/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect } from 'react';

import { useTelegram } from '@/context/TelegramContext';
import TransactionComponent from '@/components/TransactionComponent';
import HiveContainer from '@/components/HiveContainer';
import useVerifyBee from '@/hooks/useVerifyBee';
import { useRouter } from 'next/navigation';
import { useAccountInfoToken } from '@/hooks/useAccountInfoToken';
const SignTransactionPage = () => {
  const router = useRouter();
  const { user } = useTelegram();
  const userId = user?.id?.toString() ?? '792924145';
  const verifyBee = useVerifyBee(userId);
  const { accountInfo } = useAccountInfoToken(userId);

  console.log(verifyBee);
  useEffect(() => {
    if (verifyBee) {
      router.push('/game/home');
    }
  }, [verifyBee]);

  return (
    <div className=" w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      {!userId ? (
        <p> User ID is not available</p>
      ) : (
        <>
          {' '}
          <p>Saldo del token SPL: {accountInfo?.amount.toString()}</p>
          <hr />
          <div className="p-4">
            <HiveContainer />
            <TransactionComponent
              textButton="Buy your bee"
              spl={100}
              userid={userId}
              fromTrn="buyBee"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SignTransactionPage;
