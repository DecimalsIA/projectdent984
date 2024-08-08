import { NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const SOLANA_NETWORK = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_NETWORK);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicKeyStr = searchParams.get('publicKey');

  if (!publicKeyStr) {
    return NextResponse.json({ error: 'Public key is required' }, { status: 400 });
  }

  try {
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

    const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    return NextResponse.json({ transaction: serializedTransaction, publicKey: publicKeyStr });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error generating transaction' }, { status: 500 });
  }
}
