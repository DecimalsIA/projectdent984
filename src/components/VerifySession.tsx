'use client';

'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import PambiiLoader from './PambiiLoader';

import { useTelegram } from '@/context/TelegramContext';
import useBase64 from '@/hooks/useBase64';

const VerifySession = () => {
  const { setAuthenticated } = useAuth();
  const router = useRouter();
  const { user: tgUser } = useTelegram();
  const { json, decodeFromBase64 } = useBase64();

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        decodeFromBase64(token);
      }

      if (!token) {
        setAuthenticated(false);
        router.push('/login');
        return;
      }
      /*

      const response = await fetch('/api/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ token }),
      });

    const data = await response.json();
      console.log('data', data);
*/

      if (token) {
        if (!json.idWallet) {
          setAuthenticated(false);
          const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login/${tgUser?.id}?ref=https://pambii-front.vercel.app`;
          // window.location.href = deeplink;
          console.log('1', deeplink);
        } else {
          setAuthenticated(true);
          router.push('/game/home');
        }
      } else {
        setAuthenticated(false);
        if (json.firstTime) {
          router.push('/login');
        } else {
          const deeplink = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/login/${tgUser?.id}?ref=https://pambii-front.vercel.app`;
          //window.location.href = deeplink;
          console.log('2', deeplink);
        }
      }
    };

    verifySession();
  }, [router, setAuthenticated, tgUser?.id]);
  return <PambiiLoader />;
};

export default VerifySession;
