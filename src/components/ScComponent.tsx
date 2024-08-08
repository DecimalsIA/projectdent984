'use client';
import React, { useEffect, useState } from 'react';
import { usePhantomWalletSC } from '../hooks/usePhantomWalletSC';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

const TOKEN_PROGRAM_ID = new PublicKey(
  'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ',
); // Reemplaza con el ID del programa del token

const ScComponent: React.FC = () => {
  const program = usePhantomWalletSC();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const redirectToPhantom = async () => {
      // Verifica si la redirección ya se realizó
      if (localStorage.getItem('redirectedToPhantom')) {
        return;
      } else {
        // Crear el enlace deep link para Phantom
        const phantomUrl = `https://phantom.app/ul/browse/https://pambii-front.vercel.app/game/explore/buy?ref=https://pambii-front.vercel.app`;

        // Redirigir a la aplicación Phantom
        window.location.href = phantomUrl;
      }

      if (program && publicKey && signTransaction && sendTransaction) {
        try {
          // Construir la transacción
          const tokenAccount = new PublicKey(
            'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ',
          ); // Token de pago
          const amount = new BN(100); // Ajusta el monto según sea necesario

          // Llama a la función del contrato inteligente
          const tx = await program.methods
            .buyCode(amount)
            .accounts({
              user: publicKey,
              tokenAccount: tokenAccount,
              tokenProgram: TOKEN_PROGRAM_ID, // ID del programa del token
              // Otros parámetros de cuentas aquí
            })
            .transaction();

          // Firmar la transacción
          const signedTransaction = await signTransaction(tx);

          // Enviar la transacción
          const txid = await sendTransaction(
            signedTransaction,
            program.provider.connection,
          );

          // Codificar la transacción en base64
          const serializedTx = signedTransaction.serialize();
          const base64Tx = Buffer.from(serializedTx).toString('base64');

          // Crear el enlace deep link para Phantom
          const phantomUrl = `https://phantom.app/ul/browse/?uri=solana://transaction?tx=${base64Tx}`;

          // Redirigir a la aplicación Phantom
          window.location.href = phantomUrl;

          // Marcar como redirigido en localStorage
          localStorage.setItem('redirectedToPhantom', 'true');

          setResult(`Transaction initiated: ${txid}`);
        } catch (err) {
          setResult(`Error: ${(err as Error)?.message}`);
        }
      }
    };

    redirectToPhantom();
  }, [program, publicKey, signTransaction, sendTransaction]);

  return <div>{result && <p>{result}</p>}</div>;
};

export default ScComponent;
