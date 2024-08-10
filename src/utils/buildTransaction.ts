import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider, Idl, } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import bs58 from 'bs58';
import idl from './pambii_explorer.json';

const buildTransaction = async (
  senderPublicKey: PublicKey,
  tokenMintAddress: PublicKey,
  contractPublicKey: PublicKey,
  amount: number,
  connection: Connection,
  programId: PublicKey
): Promise<string> => {
  const userTokenAccount = await getAssociatedTokenAddress(
    tokenMintAddress,
    senderPublicKey
  );

  const contractTokenAccount = await getAssociatedTokenAddress(
    tokenMintAddress,
    contractPublicKey,
  );

  const program = new Program(idl as Idl, programId, new AnchorProvider(connection, {} as any, {}));
  const amountToSend = BigInt(amount) * BigInt(Math.pow(10, 9) as any); // Ajusta `6` al número de decimales de tu token
  const amountToSendBN = new anchor.BN(amountToSend.toString());

  const transaction = new Transaction().add(
    await program.methods
      .buy(new anchor.BN(amountToSendBN)) // Usamos anchor.BN para manejar el monto
      .accounts({
        user: senderPublicKey,
        userToken: userTokenAccount,
        contractToken: contractTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .instruction()
  );

  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  transaction.feePayer = senderPublicKey;

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false
  });

  return bs58.encode(serializedTransaction);
};

export { buildTransaction };
