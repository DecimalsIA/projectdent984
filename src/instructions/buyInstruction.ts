import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';

// Dirección del contrato
const contractPublicKey = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe');

// Codificar datos para el método `buy`
function encodeBuyInstruction(amount: number): Buffer {
  const amountBuffer = Buffer.alloc(8);
  new BN(amount).toArrayLike(Buffer, 'le', 8).copy(amountBuffer);
  return Buffer.concat([Buffer.from([1]), amountBuffer]); // `0` es un código para el método `buy`
}

// Construir la instrucción para el método `buy`
export async function buildBuyInstruction(
  user: PublicKey,
  userTokenAccount: PublicKey,
  contractTokenAccount: PublicKey,
  amount: number
): Promise<TransactionInstruction> {
  const data = encodeBuyInstruction(amount);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: user, isSigner: true, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: contractTokenAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data,
    programId: contractPublicKey,
  });

  return instruction;
}
