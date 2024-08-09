import {
  PublicKey,
  TransactionInstruction,
  Connection,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

// Reemplaza con los valores proporcionados
const contractPublicKey = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe'); // Contract Program ID
const tokenAddress = new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ'); // SPL Token Address
const tokenProgramId = TOKEN_PROGRAM_ID; // Usamos el TOKEN_PROGRAM_ID ya importado


// Construye la instrucción para el método `buyId` en tu contrato
export async function buildBuyIdInstruction(
  user: PublicKey,
  userAccount: PublicKey,
  splToken: PublicKey,
  contract: PublicKey,
  amount: number // Usamos `number` para el monto
): Promise<TransactionInstruction> {

  // Obtén la cuenta de token SPL asociada del usuario
  const userTokenAccount = await getAssociatedTokenAddress(tokenAddress, user);

  if (!userTokenAccount) {
    throw new Error('User token account not found');
  }


  // Convierte el monto a un array de bytes y luego a Buffer
  const amountBuffer = Buffer.alloc(8); // Asegura que el buffer tenga el tamaño adecuado
  new anchor.BN(amount).toArrayLike(Buffer, 'le', 8).copy(amountBuffer);

  console.log('amountBuffer', amountBuffer);

  const keys = [
    { pubkey: user, isSigner: true, isWritable: true },
    { pubkey: userAccount, isSigner: false, isWritable: true },
    { pubkey: userTokenAccount, isSigner: false, isWritable: true },
    { pubkey: splToken, isSigner: false, isWritable: true },
    { pubkey: contract, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  const instruction = new TransactionInstruction({
    keys,
    data: amountBuffer,
    programId: contractPublicKey,
  });

  return instruction;

}
