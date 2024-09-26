import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import idl from './pambii_explorer.json'; // Tu IDL

const buildWithdrawTransaction = async (
  senderPublicKey: PublicKey, // Dirección pública del usuario
  tokenMintAddress: PublicKey,
  contractPublicKey: PublicKey,
  contractSigner: PublicKey,
  amount: number,
  connection: Connection,
  programId: PublicKey
): Promise<string> => {
  // Obtener la cuenta de tokens del usuario
  const userTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, senderPublicKey);

  // Obtener la cuenta de tokens del contrato
  const contractTokenAccount = await getAssociatedTokenAddress(tokenMintAddress, contractPublicKey);

  // Configurar el proveedor y el programa en Anchor
  const provider = new AnchorProvider(connection, window.solana, AnchorProvider.defaultOptions());
  const program = new Program(idl as Idl, programId, provider);

  const amountToWithdraw = BigInt(amount) * BigInt(Math.pow(10, 9)); // Ajusta `9` al número de decimales de tu token
  const amountToWithdrawBN = new anchor.BN(amountToWithdraw.toString());

  // Crear la transacción
  const transaction = new Transaction().add(
    await program.methods
      .withdraw(amountToWithdrawBN) // Usamos anchor.BN para manejar el monto
      .accounts({
        user: senderPublicKey, // La cuenta del usuario
        userToken: userTokenAccount, // Cuenta de tokens SPL del usuario
        contractToken: contractTokenAccount, // Cuenta de tokens SPL del contrato
        contractSigner: contractSigner, // PDA calculada del contract signer
        tokenProgram: TOKEN_PROGRAM_ID, // Programa de tokens SPL
      })
      .signers([]) // Si necesitas firmantes adicionales, puedes agregarlos aquí
      .instruction()
  );

  // Obtener el blockhash para la transacción
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderPublicKey;

  // Serializar la transacción (sin parámetros adicionales)
  const serializedTransaction = transaction.serialize();

  return serializedTransaction.toString('base64'); // Devolver la transacción serializada en formato base64
};

export { buildWithdrawTransaction };
