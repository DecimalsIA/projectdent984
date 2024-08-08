'use client';
import React, { useState } from 'react';
import { usePhantomWalletSC } from '../hooks/usePhantomWalletSC';
import { PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

const ScComponent: React.FC = () => {
  const program = usePhantomWalletSC();
  const { publicKey } = useWallet();
  const [result, setResult] = useState<string | null>(null);

  const constructDeepLink = async (transaction: Transaction) => {
    // Codifica la transacción en formato base64
    const serializedTx = transaction.serialize();
    const base64Tx = Buffer.from(serializedTx).toString('base64');

    // Crea el deep link para Phantom
    const phantomUrl = `solana://send?tx=${base64Tx}`;

    return phantomUrl;
  };

  const handleBuyCode = async (amount: number) => {
    try {
      if (!program || !publicKey) {
        setResult('Program or wallet is not initialized');
        return;
      }

      // Construye la transacción
      const tx = await program.methods
        .buyCode(new BN(amount))
        .accounts({
          user: publicKey,
          // Otros parámetros de cuentas aquí
        })
        .transaction();

      // Codifica la transacción y construye el deep link
      const phantomUrl = await constructDeepLink(tx);

      // Redirige al usuario a la billetera Phantom
      window.location.href = phantomUrl;

      setResult('Redirecting to Phantom wallet...');
    } catch (err) {
      setResult(`Error: ${(err as Error)?.message}`);
    }
  };

  return (
    <div>
      <button onClick={() => handleBuyCode(100)}>Buy Code</button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default ScComponent;
