'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import PambiiLoader from './PambiiLoader';

import { useTelegram } from '@/context/TelegramContext';

const VerifySession = () => {
  const { login, logout } = useAuth(); // Reemplaza setAuthenticated por login y logout
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
        localStorage.removeItem('idWallet'); // Borrar del localStorage
        sessionStorage.removeItem('idWallet'); // Borrar del sessionStorage
        logout(); // Usa logout para desloguear
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
          localStorage.removeItem('idWallet'); // Borrar del localStorage si no hay idWallet
          sessionStorage.removeItem('idWallet'); // Borrar del sessionStorage si no hay idWallet
          logout(); // Usa logout en lugar de setAuthenticated(false)
          router.push('/login');
        } else {
          login(); // Usa login en lugar de setAuthenticated(true)
          router.push('/game/home');
        }
      } else {
        localStorage.removeItem('idWallet'); // Borrar del localStorage si falla
        sessionStorage.removeItem('idWallet'); // Borrar del sessionStorage si falla
        logout(); // Usa logout en lugar de setAuthenticated(false)
        if (data.firstTime) {
          console.log('data.firstTime', data.firstTime);
          router.push('/login');
        } else {
          router.push('/login');
        }
      }
    };

    verifySession();
  }, [router, login, logout, tgUser?.id]);

  return <PambiiLoader />;
};

export default VerifySession;
