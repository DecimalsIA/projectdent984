// src/instructions/withdrawAllInstruction.ts
import { TransactionInstruction, PublicKey, SystemProgram } from '@solana/web3.js';
import { programId } from './constants';

export async function buildWithdrawAllInstruction(
  owner: PublicKey,
  ownerToken: PublicKey,
  splToken: PublicKey,
  contract: PublicKey,
  tokenProgram: PublicKey
): Promise<TransactionInstruction> {
  const data = Buffer.alloc(0);

  return new TransactionInstruction({
    keys: [
      { pubkey: owner, isSigner: true, isWritable: true },
      { pubkey: ownerToken, isSigner: false, isWritable: true },
      { pubkey: splToken, isSigner: false, isWritable: true },
      { pubkey: contract, isSigner: false, isWritable: true },
      { pubkey: tokenProgram, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });
}
