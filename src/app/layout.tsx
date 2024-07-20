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
    if (typeof window !== 'undefined' && window.Telegram?.WebApp)
      Telegram?.WebApp?.expand();

    eruda.init();
    loadMessages();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale="en" messages={messages}>
          {isScriptLoaded ? (
            <AuthProvider>
              <WalletContext>{children}</WalletContext>
            </AuthProvider>
          ) : (
            <PambiiLoader />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
