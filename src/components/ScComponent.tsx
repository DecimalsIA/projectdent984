'use client';
import React, { useEffect, useState } from 'react';
import { usePhantomWalletSC } from '../hooks/usePhantomWalletSC';
import { PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

const ScComponent: React.FC = () => {
  const program = usePhantomWalletSC();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [result, setResult] = useState<string | null>(null);

  const handleBuyCode = async (amount: number) => {
    try {
      if (!program || !publicKey || !signTransaction || !sendTransaction) {
        setResult('Program or wallet is not initialized');
        return;
      }

      // Construir la transacción
      const tx = await program.methods
        .buyCode(new BN(amount))
        .accounts({
          user: publicKey,
          // Otros parámetros de cuentas aquí
        })
        .transaction();

      // Firmar la transacción
      const signedTransaction = await signTransaction(tx);

      // Codificar la transacción en base64
      const serializedTx = signedTransaction.serialize();
      const base64Tx = Buffer.from(serializedTx).toString('base64');

      // Crear el enlace deep link para Phantom
      const phantomUrl = `https://phantom.app/ul/browse/?uri=solana://transaction?tx=${base64Tx}&redirect_uri=${encodeURIComponent(
        window.location.href,
      )}`;

      // Redirigir a la aplicación Phantom
      window.location.href = phantomUrl;

      setResult('Redirecting to Phantom wallet...');
    } catch (err) {
      setResult(`Error: ${(err as Error)?.message}`);
    }
  };

  useEffect(() => {
    // Verifica si se ha regresado desde Phantom Wallet
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('transaction_status')) {
      const status = urlParams.get('transaction_status');
      setResult(`Transaction status: ${status}`);
    }
  }, []);

  return (
    <div>
      <button className="btn" onClick={() => handleBuyCode(100)}>
        Buy Code
      </button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default ScComponent;
