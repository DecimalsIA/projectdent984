/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { ButtonPambii } from 'pambii-devtrader-front';
import { useEffect } from 'react';
import Image from 'next/image';
import ConnectWallet from '@/components/ConnectWallet';

const Page: React.FC = () => {
  const { publicKey, connected } = useWallet();
  useEffect(() => {
    if (connected && publicKey) {
      const telegramBotURL = `https://t.me/PambiiGameBot?verify=${publicKey.toBase58()}`;
      //  window.location.href = telegramBotURL;
      // simulacion  redireccion juego home
      //window.location.href = '/game/home';
    }
  }, [connected, publicKey]);

  const handleClick = () => {
    const telegramBotURL = `https://t.me/PambiiGameBot?verify=${publicKey?.toBase58()}`;
    window.location.href = telegramBotURL;
  };
  return (
    <div className="min-h-screen flex items-center justify-cente  bg-screen1 lg:bg-cover">
      <div className="z-0 bg-gray-opacity border border-[#373737] py-6 px-6 shadow-md rounded-lg p-6 max-w-sm mx-auto">
        <Image
          src="/Pambii-bee.webp"
          alt="Pambii-bee"
          width={100}
          height={24}
          priority
        />
        <h1 className="text-2xl font-bold mb-4">Verify Connection</h1>
        {publicKey ? (
          <>
            {' '}
            <p className="overflow-hidden mt-4">
              Connected account: {publicKey.toBase58()}
            </p>
            <ButtonPambii
              onClick={handleClick}
              className="mb-8 mt-8"
              w="317px"
              color="white"
              bg="#FFA722"
            >
              Go to Game
            </ButtonPambii>
            <div className="w-[317px] h-[50px] px-4 pt-2.5 pb-4 bg-blue-500 rounded-[10px] shadow-inner flex-col justify-center items-center inline-flex">
              <div className="w-[317px] h-[42px] bg-blue-500 rounded-[10px] shadow border-2 border-white/opacity-20"></div>
              <div className="rounded-[10px] justify-center items-center gap-2 inline-flex">
                <img
                  className="w-[22px] h-[22px] shadow"
                  src="https://via.placeholder.com/22x22"
                />
                <div className="text-white text-xl font-semibold font-['Poppins'] leading-normal tracking-tight">
                  Connect your SOL wallet
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <ConnectWallet />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
