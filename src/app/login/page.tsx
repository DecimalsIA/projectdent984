/* eslint-disable @next/next/no-img-element */

'use client';
import React, { useEffect, useState } from 'react';
import { CardPambii, LogoGame } from 'pambii-devtrader-front';
import ConnectWallet from '@/components/ConnectWallet';
import { usePathname, useSearchParams } from 'next/navigation';

const Page: React.FC = () => {
  const searchParams = useSearchParams();

  const idUser = searchParams.get('idUser');
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
