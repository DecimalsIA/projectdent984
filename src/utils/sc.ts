import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import bs58 from 'bs58';
import BN from 'bn.js';
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
  const decimals = 9; // Número de decimales del token SPL
  // Convertir el amount a unidades más pequeñas usando BN
  const amountInTokens = params.amount; // Esta es la cantidad en tokens, por ejemplo, 1.5
  const amountInSmallestUnits = new BN(
    (amountInTokens * Math.pow(10, decimals)).toFixed(0) // Convertir a string entero sin decimales
  );


  // Construir la instrucción en función del tipo de operación
  let instruction: TransactionInstruction;
  switch (instructionType) {
    case 'buyId':
      instruction = await buildBuyIdInstruction(
        userPublicKey,
        params.userAccount,
        amountInSmallestUnits
      );
      break;
    case 'buy':
      instruction = await buildBuyInstruction(
        userPublicKey,
        params.userAccount,
        params.userToken,
        params.splToken,
        params.contract,
        TOKEN_PROGRAM_ID,
        params.amount
      );
      break;
    case 'cobrar':
      instruction = await buildCobrarInstruction(
        userPublicKey,
        params.userAccount,
        params.splToken,
        params.contract,
        TOKEN_PROGRAM_ID,
        params.amount
      );
      break;
    case 'withdrawAll':
      instruction = await buildWithdrawAllInstruction(
        userPublicKey,
        params.ownerToken,
        params.splToken,
        params.contract,
        TOKEN_PROGRAM_ID
      );
      break;
    default:
      throw new Error('Invalid instruction type');
  }

  transaction.add(instruction);

  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = userPublicKey;

  return transaction;
}

// Función para convertir la transacción a formato base58 para uso en el deeplink
export function serializeTransaction(transaction: Transaction): string {
  // Serializa la transacción sin firmar
  const serializedTransaction = transaction.serializeMessage();
  // Codifica la transacción en base58
  return bs58.encode(serializedTransaction);
}
