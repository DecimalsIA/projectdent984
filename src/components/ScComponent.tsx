'use client';
import React, { useEffect, useState } from 'react';
import { usePhantomWalletSC } from '../hooks/usePhantomWalletSC';
import { PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

const ScComponent: React.FC = () => {
  const program = usePhantomWalletSC();
  const { publicKey } = useWallet();
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const redirectToPhantom = async () => {
      // Verifica si la redirección ya se realizó
      if (localStorage.getItem('redirectedToPhantom')) {
        return;
      }

      if (program && publicKey) {
        try {
          // Construir la transacción
          const tx = await program.methods
            .buyCode(new BN(100)) // Ajusta el monto según sea necesario
            .accounts({
              user: publicKey,
              // Otros parámetros de cuentas aquí
            })
            .transaction();

          // Codificar la transacción en base64
          const serializedTx = tx.serialize();
          const base64Tx = Buffer.from(serializedTx).toString('base64');

          // Crear el enlace deep link para Phantom
          const phantomUrl = `https://phantom.app/ul/browse/?uri=solana://transaction?tx=${base64Tx}`;

          // Redirigir a la aplicación Phantom
          window.location.href = phantomUrl;

          // Marcar como redirigido en localStorage
          localStorage.setItem('redirectedToPhantom', 'true');
        } catch (err) {
          setResult(`Error: ${(err as Error)?.message}`);
        }
      }
    };

    redirectToPhantom();
  }, [program, publicKey]);

  return <div>{result && <p>{result}</p>}</div>;
};

export default ScComponent;
