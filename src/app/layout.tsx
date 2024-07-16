import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContext } from "@/context/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PAMBII GAME",
  description: "Get ready to be PAMBI-fied, Solana fam! PAMBI is a revolutionary meme coin with a unique twist – it&#x27;s backed by a team of talented creators crafting engaging content. This project isn&#x27;t just about fleeting trends  ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WalletContext>{children}</WalletContext>
      </body>
    </html>
  );
}
