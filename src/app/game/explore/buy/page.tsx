'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTelegram } from '@/context/TelegramContext';
import { ButtonPambii } from 'pambii-devtrader-front';
import TelegramGameApp from '@/components/TelegramGameApp';
import ScComponent from '@/components/ScComponent';
const PHANTOM_DEEPLINK_URL = 'https://phantom.app/ul/v1/';

const Game: React.FC = () => {
  const [publicKey] = useState('EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3');
  const [deeplink, setDeeplink] = useState('');

  useEffect(() => {
    const generateDeeplink = async () => {
      if (!publicKey) {
        console.error('Public key is not available');
        return;
      }

      try {
        const response = await fetch(`/api/transaction?publicKey=${publicKey}`);
        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        const returnUrl = 'https://t.me/PambiiGameBot'; // URL para regresar a la miniaplicación de Telegram
        const deeplinkUrl = `${PHANTOM_DEEPLINK_URL}signAndSendTransaction?app_url=${encodeURIComponent(
          returnUrl,
        )}&transaction=${encodeURIComponent(data.transaction)}`;

        setDeeplink(deeplinkUrl);
      } catch (error) {
        console.error('Error generating deeplink', error);
      }
    };

    generateDeeplink();
  }, [publicKey]);

  return (
    <div>
      <h1>Pagina </h1>
      <div>
        {deeplink && (
          <a href={deeplink} target="_blank" rel="noopener noreferrer">
            <button>Sign Transaction</button>
          </a>
        )}
      </div>
      <a
        href="https://phantom.app/ul/browse/https://pambii-front.vercel.app/game/explore/buy?ref=https://pambii-front.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ButtonPambii>BACK</ButtonPambii>
      </a>
    </div>
  );
};

export default Game;
