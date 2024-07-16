/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useCallback, useState } from "react";
import {
  useWallet,
  WalletNotSelectedError,
} from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { Keypair } from "@solana/web3.js";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { ButtonPambii } from "pambii-devtrader-front";
import SolanaIcon from "./icons/SolanaIcon";

const ConnectWallet: React.FC = () => {
  const { publicKey, wallet, connect, connecting, connected, select } =
    useWallet();
  const router = useRouter();
  const [isTelegram, setIsTelegram] = useState(false);
  const [isPhantomApp, setIsPhantomApp] = useState(false);
  const [dappKeypair] = useState(Keypair.generate());
console.log(wallet)

 useEffect(() => {
    if (typeof window !== 'undefined' && window.solana && window.solana.isPhantom) {
      setIsPhantomApp(true);
    }
  }, []);

  useEffect(() => {
    const registerConnection = async (publicKey: string) => {
      await fetch("/api/register-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicKey }),
      });
    };

    if (connected && publicKey) {
      registerConnection(publicKey.toBase58());
      if (isTelegram) {
        const telegramBotURL = `https://t.me/PambiiGameBot?start=${publicKey.toBase58()}`;
        window.location.href = telegramBotURL;
      } else {
        router.push("/verify/"+publicKey);
      }
    }
  }, [connected, publicKey, router, isTelegram]);

  const handleConnect = useCallback(async () => {
    if (!wallet) {
      select(PhantomWalletName);
    }
    try {
      if (isPhantomApp) {
        await connect();
      } else {
        const deeplink = `https://phantom.app/ul/browse/https://pambii-front-next.vercel.app?ref=https://pambii-front-next.vercel.app`;

        window.location.href = deeplink;
        console.log(deeplink);
      }
    } catch (error) {
      if (error instanceof WalletNotSelectedError) {
        console.error("Wallet not selected");
      } else {
        console.error(error);
      }
    }
  }, [connect, isPhantomApp, select, wallet]);

  useEffect(() => {
    // Detectar si se está en la webapp de Telegram
    const userAgent = navigator.userAgent || navigator.vendor;

    if (userAgent.includes("Telegram")) {
      setIsTelegram(true);
    }
    // Detectar si se está en la aplicación de Phantom
    if (userAgent.includes("Phantom")) {
      setIsPhantomApp(true);
    }
  }, []);

  useEffect(() => {
    // Conectar automáticamente si estamos en la aplicación Phantom
    if (isPhantomApp) {
      handleConnect();
    }
  }, [isPhantomApp, handleConnect]);

  return (
    <ButtonPambii
      className="mb-4"
      w="317px"
      color="white"
      icon={<SolanaIcon width={24} height={24} />}
      onClick={handleConnect}
    >
      Connect your SOL wallet
    </ButtonPambii>
  );
};

export default ConnectWallet;
