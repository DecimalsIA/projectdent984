/* eslint-disable @next/next/no-img-element */

'use client';
import React, { useEffect } from 'react';
import { CardPambii, LogoGame } from 'pambii-devtrader-front';
import ConnectWallet from '@/components/ConnectWallet';
import { useTelegram } from '@/context/TelegramContext';
import usePhantomConnection from '@/hooks/usePhantomConnection';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import useVerifyBee from '@/hooks/useVerifyBee';

const Page: React.FC = () => {
  const { user: tgUser } = useTelegram();
  const { setAuthenticated } = useAuth();
  const router = useRouter();

  // Verificar si tgUser está definido y tiene un id antes de continuar
  const userId = tgUser?.id?.toString();

  // Solo llama a usePhantomConnection si userId está disponible
  const connectionExists = usePhantomConnection(userId ?? '');
  const verifyBee = useVerifyBee(userId ?? '');

  useEffect(() => {
    if (connectionExists) {
      setAuthenticated(true);
      if (verifyBee) {
        router.push('/game/home');
      } else {
        router.push('/bee');
      }
    }
  }, [connectionExists, router, setAuthenticated, verifyBee]);

  // Mientras se verifica la existencia de tgUser y su id, se puede mostrar un indicador de carga
  if (!userId) {
    return (
      <main className="flex min-h-screen items-center justify-center p-24">
        <div className="w-[365px] space-y-4 text-center">
          <CardPambii className="text-white">
            <LogoGame className="w-100 h-100 mb-4" />
            <h2 className="text-xl font-bold mb-4">Loading...</h2>
          </CardPambii>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-[365px] space-y-4 text-center">
        <CardPambii className="text-white">
          <h2 className="text-xl font-bold mb-4">
            <span className="title">Sign Up on</span>
          </h2>
          <LogoGame className="w-100 h-100 mb-4" />
          <ConnectWallet idUserTelegram={userId} />
        </CardPambii>
      </div>
    </main>
  );
};

export default Page;
