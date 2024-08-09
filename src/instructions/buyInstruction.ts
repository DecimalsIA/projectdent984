import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import BN from 'bn.js';

const programId = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe');

export async function buildBuyInstruction(
  user: PublicKey,
  userTokenAccount: PublicKey,
  contractTokenAccount: PublicKey,
  amount: number
): Promise<TransactionInstruction> {

  // Obtén la cuenta de token SPL asociada del usuario
  const userToken = userTokenAccount;
  const contractToken = contractTokenAccount;



  if (!userToken) {
    throw new Error('User token account not found');
  }


  const scaledAmount = new BN(amount).mul(new BN(10).pow(new BN(9)));
  const data = Buffer.alloc(8);
  scaledAmount.toArrayLike(Buffer, 'le', 8).copy(data);

  const keys = [
    { pubkey: user, isSigner: true, isWritable: true },
    { pubkey: userToken, isSigner: false, isWritable: true },
    { pubkey: contractToken, isSigner: false, isWritable: true },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  const instruction = new TransactionInstruction({
    keys,
    data,
    programId,
  });

  return instruction;
}
