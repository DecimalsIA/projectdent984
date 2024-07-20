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
import useBase64 from '@/hooks/useBase64';
import useRedirectAndClose from '@/hooks/useRedirectAndClose';

interface PageProps {
  idUserTelegram?: any;
}

const ConnectWallet: React.FC<PageProps> = ({ idUserTelegram }) => {
  const { publicKey, wallet, connect, select } = useWallet();
  const { user: tgUser } = useTelegram();
  const router = useRouter();
  const [isPhantomApp, setIsPhantomApp] = useState(false);
  const [dappKeypair] = useState(Keypair.generate());
  const { closeApp } = useRedirectAndClose();

  const [input, setInput] = useState<string>('');
  const { base64, encodeToBase64, decodeFromBase64 } = useBase64();

  interface User {
    idUser?: string;
    nomTlram?: string;
    userName?: string;
    language_code?: string;
  }

  const [user, setUser] = useState<User | null>(null);

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
  const handleEncode = () => {
    try {
      const inputJson = JSON.parse(input);
      encodeToBase64(inputJson);
    } catch {
      encodeToBase64(input);
    }
  };

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
    async (publicKeyWallet: string) => {
      if (idUserTelegram) {
        try {
          const walletAddress = publicKey?.toBase58();
          console.log('registerConnection', walletAddress);
          const response = await fetch('/api/register-connection', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idUser: idUserTelegram, publicKeyWallet }),
          });

          const data = await response.json();
          console.log(data);
          setInput(data);
          handleEncode();
          // base64
          if (response.ok && data.idWallet) {
            // router.push('/game/home');
            window.location.href =
              'https://t.me/PambiiGameBot/pambii?startapp=' + base64;
          } else {
            console.error('Failed to register connection:', data);
          }
        } catch (error) {
          console.error('Error registering connection:', error);
        }
      }
    },
    [idUserTelegram, router, publicKey],
  );

  const handleConnect = useCallback(async () => {
    console.log('1');
    if (!wallet) {
      select(PhantomWalletName);
    }

    if (isPhantomApp) {
      await connect();
      if (publicKey?.toBase58()) {
        if (user) {
          await registerUser(user);
        }

        await registerConnection(publicKey.toBase58());
      }
    } else {
      const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login/${idUserTelegram}?ref=https://pambii-front.vercel.app`;
      closeApp(deeplink);
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
      icon={<SolanaIcon width="24px" height="24px" />}
      onClick={handleConnect}
    >
      Connect your SOL wallet
    </ButtonPambii>
  );
};

export default ConnectWallet;
