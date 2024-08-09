import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
// Importa las instrucciones según sea necesario
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { buildBuyInstruction } from '@/instructions/buyInstruction';
// Puedes agregar otras instrucciones como buildCobrarInstruction y buildWithdrawAllInstruction si las tienes implementadas.

const network = 'https://api.devnet.solana.com';
const connection = new Connection(network);
const programID = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe'); // Tu Program ID

// Función para construir una transacción basada en el tipo de operación
export async function buildTransaction(
  userPublicKey: PublicKey, // Usamos PublicKey aquí
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

  // Construir la instrucción en función del tipo de operación
  let instruction: TransactionInstruction;
  switch (instructionType) {
    case 'buy':
      instruction = await buildBuyInstruction(
        userPublicKey,
        params.userToken!,
        params.contractToken!,
        params.amount!
      );
      break;
    // Agrega casos adicionales para 'cobrar' y 'withdrawAll' si es necesario
    // case 'cobrar':
    //   instruction = await buildCobrarInstruction(
    //     userPublicKey,
    //     params.userAccount!,
    //     params.splToken!,
    //     params.contract!,
    //     params.amount!
    //   );
    //   break;
    // case 'withdrawAll':
    //   instruction = await buildWithdrawAllInstruction(
    //     userPublicKey,
    //     params.ownerToken!,
    //     params.splToken!,
    //     params.contract!
    //   );
    //   break;
    default:
      throw new Error('Invalid instruction type');
  }

  transaction.add(instruction);
  transaction.feePayer = userPublicKey;

  // Obtén el último blockhash para la transacción
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  return transaction;
}
