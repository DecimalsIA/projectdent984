/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect } from 'react';

import { useTelegram } from '@/context/TelegramContext';
import TransactionComponent from '@/components/TransactionComponent';
import HiveContainer from '@/components/HiveContainer';
import useVerifyBee from '@/hooks/useVerifyBee';
import { useRouter } from 'next/navigation';
import { useAccountInfoToken } from '@/hooks/useAccountInfoToken';
import { ButtonPambii } from 'pambii-devtrader-front';
import Image from 'next/image';
const SignTransactionPage = () => {
  const router = useRouter();
  const { user } = useTelegram();
  const userId = user?.id?.toString() ?? '792924145';
  const verifyBee = useVerifyBee(userId);
  const { accountInfo } = useAccountInfoToken(userId);
  const slpValue = Number(accountInfo?.amount.toString());
  console.log(slpValue);

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
              <>
                <a
                  href="https://phantom.app/ul/browse/https://raydium.io/swap/?inputMint=sol&outputMint=8dGUaPCybF4e2EbqtKcDsvW74shNTsabd5M6z6zG9BN2&ref=https://raydium.io/swap/?inputMint=sol%26outputMint=8dGUaPCybF4e2EbqtKcDsvW74shNTsabd5M6z6zG9BN2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="hivecontainer flex">
                    <div className="clickTheHive flex-wrap justify-center text-center w-[280px]">
                      You do not have a balance in PAMBII, you can buy where the
                      button
                    </div>
                  </div>
                  <ButtonPambii
                    color="white"
                    bg="#131e39"
                    className="mb-2"
                    icon={
                      <Image
                        src="https://www.pambi.tech/_next/static/media/raydium.3e1cb57d.svg"
                        alt="Select arena"
                        width={24}
                        height={24}
                      />
                    }
                  >
                    buy Pambii on Raydium
                  </ButtonPambii>{' '}
                </a>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SignTransactionPage;
