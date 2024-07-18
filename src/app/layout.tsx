/* eslint-disable @next/next/no-sync-scripts */
'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletContext } from '@/context/WalletContext';
import { useState } from 'react';
import useInjectScript from '@/hooks/useInjectScript';

const inter = Inter({ subsets: ['latin'] });
/*
export const metadata: Metadata = {
  title: 'PAMBII GAME',
  description:
    'Get ready to be PAMBI-fied, Solana fam! PAMBI is a revolutionary meme coin with a unique twist – it&#x27;s backed by a team of talented creators crafting engaging content. This project isn&#x27;t just about fleeting trends  ',
};
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useInjectScript('https://telegram.org/js/telegram-web-app.js', () =>
    setIsScriptLoaded(true),
  );
  if (!isScriptLoaded) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <div>Loading...</div>
        </body>
      </html>
    );
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WalletContext>{children}</WalletContext>
      </body>
    </html>
  );
}
