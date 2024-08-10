import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { buildBuyInstruction } from '@/instructions/buyInstruction';

// Configuración de la red Solana Devnet
const network = 'https://api.devnet.solana.com';
const connection = new Connection(network);


// Función para construir una transacción basada en el tipo de operación
export async function buildTransaction(
  userPublicKey: PublicKey,
  instructionType: 'buy' | 'cobrar' | 'withdrawAll',
  params: {
    userAccount?: PublicKey,
    userToken?: PublicKey,
    contractToken?: PublicKey,
    splToken?: PublicKey,
    contract?: PublicKey,
    amount?: number,
    ownerToken?: PublicKey,
  }
): Promise<Transaction> {
  const transaction = new Transaction();

  // Variable para almacenar la instrucción
  let instruction: TransactionInstruction;

  // Selección de la instrucción según el tipo
  switch (instructionType) {
    case 'buy':
      // Validación de los parámetros necesarios
      if (!params.userToken || !params.contractToken || params.amount === undefined) {
        throw new Error('Faltan parámetros requeridos para la instrucción de compra (buy)');
      }

      instruction = await buildBuyInstruction(
        userPublicKey,
        params.userToken,
        params.contractToken,
        params.amount
      );
      break;

    // Descomenta y agrega otros casos según sea necesario
    // case 'cobrar':
    //   if (!params.userAccount || !params.splToken || !params.contract || params.amount === undefined) {
    //     throw new Error('Faltan parámetros requeridos para la instrucción de cobrar');
    //   }
    //   instruction = await buildCobrarInstruction(
    //     userPublicKey,
    //     params.userAccount,
    //     params.splToken,
    //     params.contract,
    //     params.amount
    //   );
    //   break;

    // case 'withdrawAll':
    //   if (!params.ownerToken || !params.splToken || !params.contract) {
    //     throw new Error('Faltan parámetros requeridos para la instrucción de retirar todo (withdrawAll)');
    //   }
    //   instruction = await buildWithdrawAllInstruction(
    //     userPublicKey,
    //     params.ownerToken,
    //     params.splToken,
    //     params.contract
    //   );
    //   break;

    default:
      throw new Error('Tipo de instrucción inválido');
  }
  console.log('userPublicKey', userPublicKey.toBase58())
  // Agrega la instrucción a la transacción
  transaction.add(instruction);
  transaction.feePayer = userPublicKey;

  // Obtén el último blockhash para la transacción
  try {
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
  } catch (error) {
    console.error('Error al obtener el último blockhash:', error);
    throw new Error('No se pudo obtener el blockhash más reciente');
  }

  return transaction;
}
