'use client';

import SolanaIcon from '@/components/icons/SolanaIcon';
import { useWallet } from '@solana/wallet-adapter-react';
import { ButtonPambii } from 'pambii-devtrader-front';
import { useEffect } from 'react';
import Image from 'next/image';
import ConnectWallet from '@/components/ConnectWallet';

const Page: React.FC = () => {
  const { publicKey, connected } = useWallet();
  useEffect(() => {
    if (connected && publicKey) {
      const telegramBotURL = `https://t.me/PambiiGameBot?start=${publicKey.toBase58()}`;
      // window.location.href = telegramBotURL;
      // simulacion  redireccion juego home
      window.location.href = '/game/home';
    }
  }, [connected, publicKey]);

  const handleClick = () => {
    const telegramBotURL = `https://t.me/PambiiGameBot?start=${publicKey?.toBase58()}`;
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
