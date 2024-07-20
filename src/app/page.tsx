'use client';
import { useEffect, useState } from 'react';
import { useTelegram } from '@/context/TelegramContext';
import { isMobile } from 'react-device-detect';
import NotTelegramMobile from '@/components/NotTelegramMobile';
import Link from 'next/link';
import { ButtonPambii } from 'pambii-devtrader-front';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import VerifySession from '@/components/VerifySession';
import usePhantomWallet from '@/hooks/usePhantomWallet';
import { useSearchParams } from 'next/navigation';
import useBase64 from '@/hooks/useBase64';

const Home = () => {
  const t = useTranslations('Index');
  const { setShowBackButton, user } = useTelegram();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { isPhantomInstalled } = usePhantomWallet();
  const [startParam, setStartParam] = useState('');
  const { json, decodeFromBase64 } = useBase64();

  useEffect(() => {
    // Asegúrate de que el objeto window.Telegram.WebApp esté disponible
    if (window.Telegram && window.Telegram.WebApp) {
      const param = window.Telegram.WebApp.initDataUnsafe.start_param;
      if (param) {
        setStartParam(param);
        decodeFromBase64(param);
        localStorage.setItem('USERDATA', param);
        localStorage.setItem('authToken', json?.idsession);
        localStorage.setItem('idWallet', json?.idWallet);
      }
      console.log('Parametro recibido:', param);
    } else {
      console.error('Telegram WebApp no está disponible.');
    }
  }, [decodeFromBase64, json?.idsession, json?.idWallet]);
  useEffect(() => {
    if (user?.id) setShowBackButton(false);
  }, [setShowBackButton, user?.id]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isLoading]);
  return (
    <div>
      <>
        {isMobile ? (
          <>
            <NotTelegramMobile />
            {!user?.id && (
              <div className="w-full flex flex-col items-center justify-center font-pop mt-8">
                <div className="w-[315px]  mt-10 flex flex-col items-center justify-start gap-6">
                  <Link href="https://t.me/PambiiGameBot/pambii">
                    <ButtonPambii> {t('go_app')} </ButtonPambii>{' '}
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <>{user?.id && <VerifySession />}</>
        )}
      </>
    </div>
  );
};

export default Home;
