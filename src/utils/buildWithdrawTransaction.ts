import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import bs58 from 'bs58';
import idl from './pambii_explorer.json';

const buildWithdrawTransaction = async (
  senderPublicKey: PublicKey, // Dirección pública del usuario
  tokenMintAddress: PublicKey,
  contractPublicKey: PublicKey,
  contractAuthorityPublicKey: PublicKey, // La autoridad de la cuenta de tokens del contrato
  amount: number,
  connection: Connection,
  programId: PublicKey
): Promise<string> => {
  // Obtener la cuenta de tokens del usuario
  const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, senderPublicKey);

  // Obtener la cuenta de tokens del contrato
  const contractTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, contractPublicKey);

  // Configurar el proveedor y el programa en Anchor
  const program = new Program(idl as Idl, programId, new AnchorProvider(connection, {} as any, {}));

  const amountToWithdraw = BigInt(amount) * BigInt(Math.pow(10, 9)); // Ajustar a la precisión del token
  const amountToWithdrawBN = new anchor.BN(amountToWithdraw.toString());

  // Crear la transacción de retiro
  const transaction = new Transaction().add(
    await program.methods
      .withdraw(amountToWithdrawBN) // La cantidad que se desea retirar
      .accounts({
        user: senderPublicKey, // El usuario que solicita el retiro
        userToken: userTokenAccount, // La cuenta de tokens del usuario
        contractToken: contractTokenAccount, // La cuenta de tokens del contrato
        contractAuthority: contractTokenAccount, // La autoridad del contrato que firma la transferencia
        tokenProgram: TOKEN_PROGRAM_ID, // Programa de tokens SPL
      })
      .instruction()
  );

  // Obtener el blockhash para la transacción
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPublicKey;

  // Serializar la transacción para ser enviada
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false
  });

  return bs58.encode(serializedTransaction);
};

export { buildWithdrawTransaction };
