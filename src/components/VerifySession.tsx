'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import PambiiLoader from './PambiiLoader';

import { useTelegram } from '@/context/TelegramContext';

const VerifySession = () => {
  const { setAuthenticated } = useAuth();
  const router = useRouter();
  const { user: tgUser } = useTelegram();

  useEffect(() => {
    const verifySession = async () => {
      if (window.Telegram && window.Telegram.WebApp) {
        const param = window.Telegram.WebApp.initDataUnsafe.start_param;
        console.log('param', param);
      }
      const token = tgUser?.id.toString();
      const idWallet = localStorage.getItem('idWallet')
        ? localStorage.getItem('idWallet')
        : sessionStorage.getItem('idWallet');

      if (!token) {
        console.log('data.token', token);
        setAuthenticated(false);
        router.push('/login');
        return;
      }
      console.log({ token, idWallet });
      const response = await fetch('/api/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ idUSer: tgUser?.id.toString(), idWallet }),
      });

      const data = await response.json();

      if (response.ok && data.active) {
        if (!data.idWallet) {
          setAuthenticated(false);
          const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login/${tgUser?.id}?ref=https://pambii-front.vercel.app`;
          window.location.href = deeplink;
        } else {
          setAuthenticated(true);
          router.push('/game/home');
        }
      } else {
        setAuthenticated(false);
        if (data.firstTime) {
          console.log('data.firstTime', data.firstTime);
          router.push('/login');
        } else {
          const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login/${tgUser?.id}?ref=https://pambii-front.vercel.app`;
          window.location.href = deeplink;
        }
      }
    };

    verifySession();
  }, [router, setAuthenticated, tgUser?.id]);
  return <PambiiLoader />;
};

export default VerifySession;
