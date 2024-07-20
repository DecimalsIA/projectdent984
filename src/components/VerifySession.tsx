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
      const token = localStorage.getItem('authToken');

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
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.active) {
        if (!data.idWallet) {
          setAuthenticated(false);
          const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login?idUser=${tgUser?.id}&ref=https://pambii-front.vercel.app//login?idUser=${tgUser?.id}`;
          window.location.href = deeplink;
          console.log(deeplink);
        } else {
          setAuthenticated(true);
          router.push('/game/home');
        }
      } else {
        console.log('data', data);
        setAuthenticated(false);
        if (data.firstTime) {
          router.push('/login'); // Redirigir a la página de registro si es la primera vez
        } else {
          // router.push('/connect-wallet'); // Redirigir a la página para conectar la wallet
          const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login?idUser=${tgUser?.id}&ref=https://pambii-front.vercel.app//login?idUser=${tgUser?.id}`;
          window.location.href = deeplink;
          //console.log(deeplink);
        }
      }
    };

    verifySession();
  }, [router, setAuthenticated, tgUser?.id]);
  return <PambiiLoader />;
};

export default VerifySession;
