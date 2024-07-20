/* eslint-disable @next/next/no-img-element */

'use client';
import React, { useEffect, useState } from 'react';
import { CardPambii, LogoGame } from 'pambii-devtrader-front';
import ConnectWallet from '@/components/ConnectWallet';
import { useRouter } from 'next/router';
const Page: React.FC = () => {
  const router = useRouter();
  const idUser = router.query.idUser;

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-[365px] space-y-4 text-center">
        <CardPambii className=" text-white">
          <h2 className="text-xl font-bold mb-4">
            <span className="title">Sign Up on</span> <p>{idUser}</p>
          </h2>
          <LogoGame className="w-100 h-100 mb-4" />
          <ConnectWallet idUserTelegram={idUser} />
        </CardPambii>
      </div>
    </main>
  );
};
export default Page;
