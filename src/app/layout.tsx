/* eslint-disable @next/next/no-sync-scripts */
'use client';
import { NextIntlClientProvider } from 'next-intl';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletContext } from '@/context/WalletContext';
import { useEffect, useState } from 'react';
import useInjectScript from '@/hooks/useInjectScript';
import eruda from 'eruda';
import PambiiLoader from '@/components/PambiiLoader';
import { AuthProvider } from '@/context/AuthContext';
const inter = Inter({ subsets: ['latin'] });
import { Toaster } from 'react-hot-toast';
import { NextUIProvider } from '@nextui-org/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useInjectScript('https://telegram.org/js/telegram-web-app.js', () =>
    setIsScriptLoaded(true),
  );
  const [messages, setMessages] = useState({});

  useEffect(() => {
    async function loadMessages() {
      const locale = navigator.language.split('-')[0] || 'en'; // Obtener el idioma del navegador
      const response = await fetch(`/messages/${locale}.json`);
      const data = await response.json();

      setMessages(data);
    }

    loadMessages();

    if (isScriptLoaded) {
      Telegram?.WebApp?.expand();
      import('eruda')
        .then((eruda) => {
          eruda.default.init();
        })
        .catch((err) => {
          console.error('Failed to load eruda', err);
        });
    }
  }, [isScriptLoaded]);

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <NextUIProvider>
          <NextIntlClientProvider locale="en" messages={messages}>
            {isScriptLoaded ? (
              <AuthProvider>
                <Toaster position="bottom-center" />
                <WalletContext>{children}</WalletContext>
              </AuthProvider>
            ) : (
              <PambiiLoader />
            )}
          </NextIntlClientProvider>{' '}
        </NextUIProvider>
      </body>
    </html>
  );
}
