/* eslint-disable @next/next/no-img-element */

'use client';
import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CardPambii, LogoGame } from 'pambii-devtrader-front';
import ConnectWallet from '@/components/ConnectWallet';

const Page: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(router.query);

  const [data, setData] = useState(null);
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-[365px] space-y-4 text-center">
        <CardPambii className=" text-white">
          <h2 className="text-xl font-bold mb-4">
            <span className="title">Sign Up on</span>{' '}
          </h2>
          <LogoGame className="w-100 h-100 mb-4" />
          <ConnectWallet />
          {JSON.stringify(router.query)}
        </CardPambii>
      </div>
    </main>
  );
};
export default Page;
