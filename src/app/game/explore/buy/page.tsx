'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTelegram } from '@/context/TelegramContext';
import { ButtonPambii } from 'pambii-devtrader-front';
import TelegramGameApp from '@/components/TelegramGameApp';
import ScComponent from '@/components/ScComponent';
import { useSearchParams, useRouter } from 'next/navigation';
const PHANTOM_DEEPLINK_URL = 'https://phantom.app/ul/v1/';

const Game: React.FC = () => {
  const [publicKey] = useState('EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3');
  const [deeplink, setDeeplink] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

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

        const returnUrl = `${window.location.origin}/?signedTransaction=`;
        const deeplinkUrl = `${PHANTOM_DEEPLINK_URL}signTransaction?app_url=${encodeURIComponent(
          returnUrl,
        )}&transaction=${encodeURIComponent(data.transaction)}`;

        setDeeplink(deeplinkUrl);
      } catch (error) {
        console.error('Error generating deeplink', error);
      }
    };

    generateDeeplink();
  }, [publicKey]);

  useEffect(() => {
    const sendSignedTransaction = async (signedTransaction: any) => {
      try {
        const response = await fetch('/api/send-transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transaction: signedTransaction }),
        });

        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        console.log('Transaction sent with signature:', data.signature);
      } catch (error) {
        console.error('Error sending transaction', error);
      }
    };

    const signedTransaction = searchParams.get('signedTransaction');
    if (signedTransaction) {
      sendSignedTransaction(signedTransaction);
      router.replace('/');
    }
  }, [searchParams, router]);
  return (
    <div>
      <div>
        {deeplink && (
          <a href={deeplink} target="_blank" rel="noopener noreferrer">
            <ButtonPambii>Sign Transaction</ButtonPambii>
          </a>
        )}
      </div>
    </div>
  );
};

export default Game;
