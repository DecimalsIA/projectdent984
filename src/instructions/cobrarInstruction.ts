// src/instructions/cobrarInstruction.ts
import { TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from 'bn.js';
import { programId } from './constants';

export async function buildCobrarInstruction(
  user: PublicKey,
  userAccount: PublicKey,
  splToken: PublicKey,
  contract: PublicKey,
  tokenProgram: PublicKey,
  amount: number
): Promise<TransactionInstruction> {
  const data = Buffer.alloc(8);
  new BN(amount).toBuffer('le', 8).copy(data);

  return new TransactionInstruction({
    keys: [
      { pubkey: user, isSigner: true, isWritable: true },
      { pubkey: userAccount, isSigner: false, isWritable: true },
      { pubkey: splToken, isSigner: false, isWritable: true },
      { pubkey: contract, isSigner: false, isWritable: true },
      { pubkey: tokenProgram, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });
}
