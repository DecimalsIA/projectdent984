/* eslint-disable @next/next/no-img-element */

'use client';
import React, { useEffect, useState } from 'react';

import { CardPambii, LogoGame } from 'pambii-devtrader-front';
import ConnectWallet from '@/components/ConnectWallet';
import { usePathname, useSearchParams } from 'next/navigation';

const Page: React.FC = () => {
  const [verify, setVerify] = useState<any>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyParam = params.get('verify');
    setVerify(verifyParam);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-[365px] space-y-4 text-center">
        <CardPambii className=" text-white">
          <h2 className="text-xl font-bold mb-4">
            <span className="title">Sign Up on</span>{' '}
          </h2>
          <LogoGame className="w-100 h-100 mb-4" />
          <ConnectWallet />
          ----llll {verify}
          ---- 333 {verifyParam}
        </CardPambii>
      </div>
    </main>
  );
};
export default Page;
