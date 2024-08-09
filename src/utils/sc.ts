
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
// Ruta a las funciones de instrucciones
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { buildBuyIdInstruction } from '@/instructions/buyIdInstruction';
import { buildBuyInstruction } from '@/instructions/buyInstruction';
import { buildCobrarInstruction } from '@/instructions/cobrarInstruction';
import { buildWithdrawAllInstruction } from '@/instructions/withdrawAllInstruction';

const network = 'https://api.devnet.solana.com';
const connection = new Connection(network);
const programID = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe'); // Tu Program ID

// Función para construir una transacción basada en el tipo de operación
export async function buildTransaction(
  userPublicKey: PublicKey, // Usamos PublicKey aquí
  instructionType: 'buyId' | 'buy' | 'cobrar' | 'withdrawAll',
  params?: any // Los parámetros necesarios para la instrucción, como 'amount' y las otras cuentas
): Promise<Transaction> {
  const transaction = new Transaction();

  // Construir la instrucción en función del tipo de operación
  let instruction: TransactionInstruction;
  switch (instructionType) {
    case 'buyId':
      instruction = await buildBuyIdInstruction(
        userPublicKey,
        params.userAccount,
        params.splToken,
        params.contract,
        params.amount
      );
      break;
    case 'buy':
      instruction = await buildBuyInstruction(
        userPublicKey,
        params.userAccount,
        params.userToken,
        params.splToken,
        params.contract,
        params.tokenProgram,
        params.amount
      );
      break;
    case 'cobrar':
      instruction = await buildCobrarInstruction(
        userPublicKey,
        params.userAccount,
        params.splToken,
        params.contract,
        params.tokenProgram,
        params.amount
      );
      break;
    case 'withdrawAll':
      instruction = await buildWithdrawAllInstruction(
        userPublicKey,
        params.ownerToken,
        params.splToken,
        params.contract,
        params.tokenProgram,
      );
      break;
    default:
      throw new Error('Invalid instruction type');
  }

  transaction.add(instruction);
  transaction.feePayer = userPublicKey;
  const anyTransaction: any = transaction;

  anyTransaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;


  return transaction;
}

