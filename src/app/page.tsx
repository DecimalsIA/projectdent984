'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ButtonPambii } from 'pambii-devtrader-front';
import { useTelegram } from '@/context/TelegramContext';

const Home = () => {
  const { showBackButton, setShowBackButton, user } = useTelegram();
  const [verify, setVerify] = useState<string | null>(null);

  useEffect(() => {
    setShowBackButton(false);
  }, [setShowBackButton, showBackButton]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const verifyParam = queryParams.get('verify');
    console.log('verify--->', verifyParam);
    setVerify(verifyParam);
  }, []);

  return (
    <div>
      <h1>
        Telegram WebApp <p>Bienvenido, {user?.first_name}</p>
      </h1>
      <hr />
      <div>
        {' '}
        <Link href="/game">
          <ButtonPambii>IR AL GAME</ButtonPambii>{' '}
        </Link>
        {verify && <p>El parámetro de verificación es: {verify}</p>}
      </div>
    </div>
  );
};

export default Home;
