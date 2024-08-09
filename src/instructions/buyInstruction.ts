import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

const contractPublicKey = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe');

export async function buildBuyInstruction(
  user: PublicKey,
  userTokenAccount: PublicKey,
  contractTokenAccount: PublicKey,
  amount: number
): Promise<TransactionInstruction> {
  // Convierte el monto a un buffer de 8 bytes
  const amountToSend = new anchor.BN(amount).toArrayLike(Buffer, 'le', 8);

  const keys = [
    { pubkey: user, isSigner: true, isWritable: true },
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: contractTokenAccount, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  const instruction = new TransactionInstruction({
    keys,
    data: amountToSend,
    programId: contractPublicKey,
  });

  return instruction;
}
