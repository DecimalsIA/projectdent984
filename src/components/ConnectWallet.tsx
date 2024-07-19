/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useCallback, useState } from 'react';
import {
  useWallet,
  WalletNotSelectedError,
} from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { Keypair } from '@solana/web3.js';
import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { ButtonPambii } from 'pambii-devtrader-front';
import SolanaIcon from './icons/SolanaIcon';
import { useTelegram } from '@/context/TelegramContext';

const ConnectWallet: React.FC = () => {
  const { publicKey, wallet, connect, connecting, connected, select } =
    useWallet();
  const { setShowBackButton, user: tgUser } = useTelegram();
  const router = useRouter();
  const [isPhantomApp, setIsPhantomApp] = useState(false);
  const [dappKeypair] = useState(Keypair.generate());

  interface User {
    idUser?: string;
    nomTlram?: string;
    userName?: string;
    language_code?: string;
  }

  const [user, setUser] = useState<User | null>({});

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.solana &&
      window.solana.isPhantom
    ) {
      setIsPhantomApp(true);
    }
    if (tgUser) {
      setUser({
        idUser: tgUser.id.toString(),
        nomTlram: `${tgUser.first_name} ${tgUser.last_name}`,
        userName: tgUser.username,
        language_code: tgUser.language_code,
      });
    }
  }, [tgUser]);

  const registerUser = useCallback(async () => {
    const response = await fetch('/api/register-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();

    if (response.ok && data.message === 'User already registered') {
      setUser((prev) => ({ ...prev, id: data.id }));
    } else if (response.ok && data.message === 'User registered') {
      setUser((prev) => ({ ...prev, id: data.id }));
    }
  }, [user]);

  const registerConnection = useCallback(
    async (publicKey: string) => {
      const response = await fetch('/api/register-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idUser: user.idUser, publicKey }),
      });
      const data = await response.json();

      if (response.ok && data.idWallet) {
        router.push('/game/home');
      }
    },
    [user.idUser, router],
  );

  const handleConnect = useCallback(async () => {
    if (!wallet) {
      select(PhantomWalletName);
    }
    try {
      if (isPhantomApp) {
        await connect();
        if (publicKey) {
          await registerUser();
          await registerConnection(publicKey.toBase58());
        }
      } else {
        const deeplink = `https://phantom.app/ul/browse/https://pambii-front-next.vercel.app?ref=https://pambii-front-next.vercel.app`;
        window.location.href = deeplink;
        console.log(deeplink);
      }
    } catch (error) {
      if (error instanceof WalletNotSelectedError) {
        console.error('Wallet not selected');
      } else {
        console.error(error);
      }
    }
  }, [
    connect,
    isPhantomApp,
    publicKey,
    select,
    wallet,
    registerUser,
    registerConnection,
  ]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (userAgent.includes('Phantom')) {
      setIsPhantomApp(true);
    }
  }, []);

  useEffect(() => {
    if (isPhantomApp) {
      handleConnect();
    }
  }, [isPhantomApp, handleConnect]);

  return (
    <ButtonPambii
      className="mb-4"
      w="317px"
      color="white"
      icon={<SolanaIcon width={24} height={24} />}
      onClick={handleConnect}
    >
      Connect your SOL wallet
    </ButtonPambii>
  );
};

export default ConnectWallet;
