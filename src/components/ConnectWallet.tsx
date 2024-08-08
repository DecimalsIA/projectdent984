/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';

import { PhantomWalletName } from '@solana/wallet-adapter-wallets';
import { ButtonPambii } from 'pambii-devtrader-front';
import SolanaIcon from './icons/SolanaIcon';
import { useTelegram } from '@/context/TelegramContext';
import usePhantomConnect from '@/hooks/usePhantomConnect';

interface PageProps {
  idUserTelegram?: any;
}
interface User {
  idUser?: string;
  nomTlram?: string;
  userName?: string;
  language_code?: string;
}
const ConnectWallet: React.FC<PageProps> = ({ idUserTelegram }) => {
  const { user: tgUser } = useTelegram();
  const { url } = usePhantomConnect(idUserTelegram.toString());
  const [user, setUser] = useState<User | null>(null);
  console.log(idUserTelegram);
  console.log('url', url);

  useEffect(() => {
    if (tgUser) {
      const userTel = {
        idUser: tgUser.id.toString(),
        userId: idUserTelegram.toString(),
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
  /*
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
        } catch (error) {
          console.error('Error registering connection:', error);
        }
      }
    },
    [idUserTelegram, router, publicKey],
  ); */

  return (
    url && (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <ButtonPambii
          className="mb-4"
          w="317px"
          color="white"
          icon={<SolanaIcon width="24px" height="24px" />}
        >
          Connect your SOL wallet
        </ButtonPambii>{' '}
      </a>
    )
  );
};

export default ConnectWallet;
