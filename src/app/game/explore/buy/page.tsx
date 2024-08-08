'use client';
import { useEffect, useState } from 'react';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import { useSearchParams, useRouter } from 'next/navigation';

const PHANTOM_DEEPLINK_URL = 'https://phantom.app/ul/v1/';
const SOLANA_NETWORK = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_NETWORK);

const Home: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string>(
    'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3',
  );
  const [deeplink, setDeeplink] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const createTransaction = async (
    publicKeyStr: string,
  ): Promise<Transaction> => {
    const publicKey = new PublicKey(publicKeyStr);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey('9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y'), // Reemplaza con la dirección de destinatario
        lamports: 1000, // Cantidad en lamports (1 SOL = 1,000,000,000 lamports)
      }),
    );

    transaction.feePayer = publicKey;
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;

    return transaction;
  };

  useEffect(() => {
    const generateDeeplink = async () => {
      if (!publicKey) {
        console.error('Public key is not available');
        return;
      }

      try {
        const transaction = await createTransaction(publicKey);
        const serializedTransaction = transaction
          .serialize({ requireAllSignatures: false })
          .toString('base64');

        const returnUrl = `https://t.me/@PambiiGameBot?signedTransaction=`;
        const deeplinkUrl = `${PHANTOM_DEEPLINK_URL}signTransaction?app_url=${encodeURIComponent(
          returnUrl,
        )}&transaction=${encodeURIComponent(serializedTransaction)}`;

        setDeeplink(deeplinkUrl);
      } catch (error) {
        console.error('Error generating deeplink', error);
      }
    };

    generateDeeplink();
  }, [publicKey]);

  useEffect(() => {
    const sendSignedTransaction = async (signedTransaction: string) => {
      try {
        const deserializedTransaction = Transaction.from(
          Buffer.from(signedTransaction, 'base64'),
        );
        const signature = await connection.sendRawTransaction(
          deserializedTransaction.serialize(),
        );

        console.log('Transaction sent with signature:', signature);
      } catch (error) {
        console.error('Error sending transaction', error);
      }
    };

    const signedTransaction = searchParams.get('signedTransaction');
    if (signedTransaction) {
      sendSignedTransaction(signedTransaction);
      router.replace('/');
    }
  }, [searchParams, router]);

  return (
    <div>
      {deeplink && (
        <a href={deeplink} target="_blank" rel="noopener noreferrer">
          <button>Sign Transaction</button>
        </a>
      )}
    </div>
  );
};

export default Home;
