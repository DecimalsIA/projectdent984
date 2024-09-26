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

  // Derivar la PDA del contract_signer en el frontend usando la misma semilla y programa
  const [contractSigner] = await PublicKey.findProgramAddress(
    [Buffer.from("authority")], // Semilla utilizada en el contrato para derivar la PDA
    programId
  );

  // Ajustar `9` al número de decimales de tu token
  const amountToWithdraw = BigInt(amount) * BigInt(Math.pow(10, 9));
  const amountToWithdrawBN = new anchor.BN(amountToWithdraw.toString());

  // Crear la transacción de retiro
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

  // Codificar la transacción serializada en Base58 y devolverla
  return bs58.encode(serializedTransaction);
};

export { buildWithdrawTransaction };
