import { NextResponse } from 'next/server';
import { Connection, Transaction } from '@solana/web3.js';

const SOLANA_NETWORK = 'https://api.mainnet.solana.com';
const connection = new Connection(SOLANA_NETWORK);

export async function POST(request: Request) {
  const { transaction } = await request.json();

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction is required' }, { status: 400 });
  }

  try {
    const deserializedTransaction = Transaction.from(Buffer.from(transaction, 'base64'));
    const signature = await connection.sendRawTransaction(deserializedTransaction.serialize());

    return NextResponse.json({ signature });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error sending transaction' }, { status: 500 });
  }
}
