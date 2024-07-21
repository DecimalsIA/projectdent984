/* eslint-disable @next/next/no-sync-scripts */
'use client';
import Footer from '@/components/Footer';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full m-0 p-0 min-h-screen bg-cover bg-center flex flex-col items-center justify-between">
      {children}
      <div className="flex flex-row  justify-center">
        <Footer />
      </div>
    </div>
  );
}
