import { NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import idl from '../../../components/game_explorer.json'; // Ajusta la ruta según sea necesario

const programId = new PublicKey(idl.metadata.address); // ID del programa
const network = 'https://api.mainnet.solana.com'; // Red de Solana

export async function POST(request: Request) {
  try {
    const { amount, userPublicKey } = await request.json();

    // Validar los datos recibidos
    if (!amount || !userPublicKey) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const connection = new Connection(network, 'confirmed');
    const provider = new AnchorProvider(connection, {} as any, { preflightCommitment: 'confirmed' });
    const program = new Program(idl as Idl, programId, provider);

    // Convertir el parámetro a PublicKey
    const userPublicKeyObj = new PublicKey(userPublicKey);

    // Obtener el blockhash reciente
    const { blockhash } = await connection.getRecentBlockhash();

    // Crear la transacción
    const transaction = await program.methods
      .buyCode(new BN(amount))
      .accounts({
        user: new PublicKey(userPublicKeyObj),
        // Otros parámetros de cuentas opcionales o con valores predeterminados aquí
        userDevfiTokenAccount: new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ'), // Reemplaza con el valor real o usa `PublicKey.default`
        tokenVault: new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ'), // Reemplaza con el 
      })
      .transaction();

    // Establecer el blockhash reciente en la transacción
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(userPublicKeyObj);


    // Codificar la transacción en formato base64
    const serializedTx = transaction.serialize();
    const base64Tx = Buffer.from(serializedTx).toString('base64');


    return NextResponse.json({ base64Tx });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
