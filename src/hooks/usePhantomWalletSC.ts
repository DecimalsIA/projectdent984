// hooks/usePhantomWalletSC.ts
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, web3, Idl } from '@project-serum/anchor';
import idl from '../components/game_explorer.json'; // Reemplaza con la ruta correcta
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-adapter-base';

const programId = new PublicKey(idl.metadata.address); // ID del programa
const network = web3.clusterApiUrl('devnet'); // O usa 'testnet' o 'mainnet-beta'

export const usePhantomWalletSC = () => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [program, setProgram] = useState<Program | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    const conn = new Connection(network, 'confirmed'); // Crea una instancia de Connection
    setConnection(conn);

    if (publicKey && signTransaction) {
      const idlObject: Idl = JSON.parse(JSON.stringify(idl)); // Convert the idl object to the correct type

      const provider = {
        connection: conn,
        wallet: {
          publicKey,
          signTransaction: async (transaction: Transaction) => {
            if (!signTransaction) throw new Error('Wallet does not support signTransaction');
            return await signTransaction(transaction);
          },
          name: 'Phantom Wallet',
          url: 'https://www.phantom.app',
          icon: 'https://www.phantom.app/icon.png',
          readyState: 'connected',
          // Add any other required properties here
        },
        opts: { preflightCommitment: 'confirmed' },
      };

      const program = new Program(idlObject, programId, provider);
      setProgram(program);
    }
  }, [publicKey, signTransaction]);

  return program;
};
