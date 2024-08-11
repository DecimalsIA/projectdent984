import { useState, useEffect } from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const useSolanaNetwork = (connection: Connection) => {
  const [network, setNetwork] = useState<string | null>(null);

  useEffect(() => {
    const getNetwork = async () => {
      try {
        const version = await connection.getVersion();
        if (connection.rpcEndpoint.includes('devnet')) {
          setNetwork('devnet');
        } else if (connection.rpcEndpoint.includes('testnet')) {
          setNetwork('testnet');
        } else {
          setNetwork('mainnet-beta');
        }
      } catch (error) {
        console.error('Error fetching network:', error);
        setNetwork(null);
      }
    };

    getNetwork();
  }, [connection]);

  return network;
};

export default useSolanaNetwork;
