import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

interface UsePhantomWallet {
  isPhantomInstalled: boolean;
  isPhantomConnected: boolean;
  connectToPhantom: () => Promise<void>;
  disconnectFromPhantom: () => Promise<void>;
}

const usePhantomWallet = (): UsePhantomWallet => {
  const { wallet, connected, connect, disconnect } = useWallet();
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.solana &&
      window.solana.isPhantom
    ) {
      setIsPhantomInstalled(true);
    } else {
      setIsPhantomInstalled(false);
    }
  }, []);

  const connectToPhantom = async () => {
    if (!connected && wallet && wallet.adapter.name === 'Phantom') {
      await connect();
    }
  };

  const disconnectFromPhantom = async () => {
    if (connected && wallet && wallet.adapter.name === 'Phantom') {
      await disconnect();
    }
  };

  return {
    isPhantomInstalled,
    isPhantomConnected: connected,
    connectToPhantom,
    disconnectFromPhantom,
  };
};

export default usePhantomWallet;
