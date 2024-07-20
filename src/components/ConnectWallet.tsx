/* eslint-disable react-hooks/exhaustive-deps */
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
import { generateAuthToken } from '@/utils/auth';
interface PageProps {
  idUserTelegram?: any;
}
const ConnectWallet: React.FC<PageProps> = ({ idUserTelegram }) => {
  const { publicKey, wallet, connect, connecting, connected, select } =
    useWallet();
  const { user: tgUser } = useTelegram();
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
      const userTel = {
        idUser: tgUser.id.toString(),
        nomTlram: `${tgUser.first_name} ${tgUser.last_name}`,
        userName: tgUser.username,
        language_code: tgUser.language_code,
      };
      setUser(userTel);
      registerUser(userTel);
    }
  }, [tgUser]);

  const registerUser = useCallback(
    async (obj: User) => {
      const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      const data = await response.json();
      if (response.ok && data.message === 'User already registered') {
        setUser((prev) => ({ ...prev, id: data.id }));
      } else if (response.ok && data.message === 'User registered') {
        setUser((prev) => ({ ...prev, id: data.id }));
      }
    },
    [user],
  );

  const registerConnection = useCallback(
    async (publicKey: string) => {
      if (idUserTelegram) {
        const response = await fetch('/api/register-connection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idUser: idUserTelegram, publicKey }),
        });
        const data = await response.json();

        if (response.ok && data.idWallet) {
          router.push('/game/home');
        }
      }
    },
    [idUserTelegram, router],
  );

  const handleConnect = useCallback(async () => {
    if (!wallet) {
      select(PhantomWalletName);
    }
    try {
      if (isPhantomApp) {
        await connect();
        if (publicKey) {
          const idsession = generateAuthToken({ publicKey });
          localStorage.setItem('authToken', idsession);
          if (user) {
            await registerUser(user);
          }
          await registerConnection(publicKey.toBase58());
        }
      } else {
        const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login?idUser=${idUserTelegram}?ref=https://pambii-front.vercel.app`;
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
      Connect your SOL wallet {tgUser?.first_name}
    </ButtonPambii>
  );
};

export default ConnectWallet;
