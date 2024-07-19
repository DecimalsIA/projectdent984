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

const Home = () => {
  const t = useTranslations('Index');
  const { setShowBackButton, user } = useTelegram();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const {
    isPhantomInstalled,
    isPhantomConnected,
    connectToPhantom,
    disconnectFromPhantom,
  } = usePhantomWallet();

  useEffect(() => {
    if (user?.id) setShowBackButton(false);
  }, [setShowBackButton, user?.id]);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isAuthenticated, isLoading]);
  // isMobile && user?.id
  return (
    <div>
      <>
        {!isMobile ? (
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
          <>
            {user?.id && <VerifySession />}
            {isPhantomInstalled && <VerifySession />}
          </>
        )}
      </>
    </div>
  );
};

export default Home;
