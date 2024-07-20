'use client';

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
      const token = localStorage.getItem('USERDATA');
      const idWallet = localStorage.getItem('idWallet');

      if (!token) {
        setAuthenticated(false);
        router.push('/login');
        return;
      }
      const response = await fetch('/api/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ token, idWallet }),
      });

      const data = await response.json();

      if (response.ok && data.active) {
        if (!data.idWallet) {
          setAuthenticated(false);
          const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login/${tgUser?.id}?ref=https://pambii-front.vercel.app`;
          window.location.href = deeplink;
          console.log('1', deeplink);
        } else {
          setAuthenticated(true);
          router.push('/game/home');
        }
      } else {
        setAuthenticated(false);
        if (data.firstTime) {
          router.push('/login');
        } else {
          alert(data.message);
          const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login/${tgUser?.id}?ref=https://pambii-front.vercel.app`;
          //  window.location.href = deeplink;
        }
      }
    };

    verifySession();
  }, [router, setAuthenticated, tgUser?.id]);
  return <PambiiLoader />;
};

export default VerifySession;
