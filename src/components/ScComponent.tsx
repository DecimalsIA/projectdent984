'use client';
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const ScComponent: React.FC = () => {
  const { publicKey } = useWallet();
  const [result, setResult] = useState<string | null>(null);

  const handleBuyCode = async (amount: number) => {
    try {
      // Llamar a la API para obtener la transacción en base64
      const response = await fetch('/api/sigExplorer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          userPublicKey: 'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.statusText}`);
      }

      const { base64Tx } = await response.json();

      // Construir la URL de redirección a Phantom
      const phantomUrl = `phantom://v1/transaction?tx=${base64Tx}`;
      window.location.href = phantomUrl;

      setResult('Redirecting to Phantom wallet...');
    } catch (error) {
      setResult(`Error: ${(error as Error)?.message}`);
    }
  };

  return (
    <div>
      <button className="btn button-pambii" onClick={() => handleBuyCode(10)}>
        Buy Code
      </button>
      {result && <p>{result}</p>}
    </div>
  );
};

export default ScComponent;
