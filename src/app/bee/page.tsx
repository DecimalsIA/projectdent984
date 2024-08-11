/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect } from 'react';

import { useTelegram } from '@/context/TelegramContext';
import TransactionComponent from '@/components/TransactionComponent';
import HiveContainer from '@/components/HiveContainer';
import useVerifyBee from '@/hooks/useVerifyBee';
import { useRouter } from 'next/navigation';
import { useAccountInfoToken } from '@/hooks/useAccountInfoToken';

import NoSaldo from '@/components/NoSaldo';
const SignTransactionPage = () => {
  const router = useRouter();
  const { user } = useTelegram();
  const userId = user?.id?.toString() ?? '792924145';
  const verifyBee = useVerifyBee(userId);
  const { accountInfo } = useAccountInfoToken(userId);
  const slpValue = Number(accountInfo?.amount.toString());

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
          <hr />
          <div className="p-4">
            <HiveContainer />
            {slpValue > 100 ? (
              <TransactionComponent
                textButton="Buy your bee"
                spl={100}
                userid={userId}
                fromTrn="buyBee"
              />
            ) : (
              <NoSaldo id={userId} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SignTransactionPage;
