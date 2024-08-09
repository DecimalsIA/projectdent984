import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import BN from 'bn.js';
const contractPublicKey = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe');

const splToken = new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ');

export async function buildBuyInstruction(
  user: PublicKey,
  userTokenAccount: PublicKey,
  contractTokenAccount: PublicKey,
  amount: number
): Promise<TransactionInstruction> {

  // Obtén la cuenta de token SPL asociada del usuario
  const userToken = await getAssociatedTokenAddress(splToken, user);
  const contractToken = await getAssociatedTokenAddress(splToken, contractPublicKey);

  console.log('user', user.toString())
  console.log('userToken', userToken.toString())
  console.log('contractToken', contractToken.toString())

  if (!userTokenAccount) {
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
    programId: contractPublicKey,
  });

  return instruction;
}
