import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

const contractPublicKey = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe');

const splToken = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe');

export async function buildBuyInstruction(
  user: PublicKey,
  userTokenAccount: PublicKey,
  contractTokenAccount: PublicKey,
  amount: number
): Promise<TransactionInstruction> {

  // Obtén la cuenta de token SPL asociada del usuario
  const userToken = await getAssociatedTokenAddress(splToken, user);
  const contractToken = await getAssociatedTokenAddress(splToken, contractPublicKey);

  if (!userTokenAccount) {
    throw new Error('User token account not found');
  }
  console.log('buildBuyInstruction')

  // Convierte el monto a un buffer de 8 bytes
  //const amountToSend = BigInt(amount) * BigInt(Math.pow(10, 9) as any);
  const transferAmount = 0.01;
  // Convierte el monto a un array de bytes y luego a Buffer
  const data = Buffer.alloc(4 + 8); // Asegura que el buffer tenga el tamaño adecuado
  data.writeUInt32LE(amount, 0);
  data.writeBigUInt64LE(BigInt(transferAmount * LAMPORTS_PER_SOL), 4);

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
