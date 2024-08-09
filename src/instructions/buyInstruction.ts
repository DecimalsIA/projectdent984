import {
  PublicKey,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

// Reemplaza con los valores proporcionados
const contractPublicKey = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe'); // Contract Program ID
const tokenAddress = new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ'); // SPL Token Address


// Construye la instrucción para el método `buy` en tu contrato
export async function buildBuyInstruction(
  user: PublicKey,
  userTokenAccount: PublicKey, // Esta es la cuenta de tokens SPL del usuario
  contractTokenAccount: PublicKey, // Esta es la cuenta de tokens SPL del contrato
  amount: number // Usamos `number` para el monto
): Promise<TransactionInstruction> {

  // Convierte el monto a un array de bytes y luego a Buffer
  const amountBuffer = Buffer.alloc(8); // Asegura que el buffer tenga el tamaño adecuado
  new anchor.BN(amount).toArrayLike(Buffer, 'le', 8).copy(amountBuffer);

  console.log('amountBuffer', amountBuffer);

  const keys = [
    { pubkey: user, isSigner: true, isWritable: true }, // El usuario firmará la transacción
    { pubkey: userTokenAccount, isSigner: false, isWritable: true }, // Cuenta de tokens SPL del usuario
    { pubkey: contractTokenAccount, isSigner: false, isWritable: true }, // Cuenta de tokens SPL del contrato
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // Programa de tokens SPL
  ];

  const instruction = new TransactionInstruction({
    keys,
    data: amountBuffer,
    programId: contractPublicKey,
  });

  return instruction;
}
