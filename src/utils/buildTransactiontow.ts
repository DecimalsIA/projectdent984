import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import bs58 from 'bs58';

// Esta función construye una instrucción para llamar a un método de un contrato inteligente
const buildTransaction = async (
  senderPublicKey: PublicKey,
  tokenMintAddress: PublicKey,
  contractPublicKey: PublicKey,
  amount: number,
  connection: Connection,
): Promise<string> => {
  // Obtener la cuenta de tokens SPL asociada al usuario y al contrato
  const userTokenAccount = await getAssociatedTokenAddress(
    tokenMintAddress,
    senderPublicKey
  );

  const contractTokenAccount = await getAssociatedTokenAddress(
    tokenMintAddress,
    contractPublicKey,
  );

  // Crear los datos que el contrato espera
  const data = Buffer.alloc(8); // Ajustar el tamaño del buffer según los datos necesarios
  data.writeBigUInt64LE(BigInt(amount), 0); // Escribir el monto en el buffer

  // Crear la instrucción para llamar al método 'buy' en el contrato
  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: senderPublicKey, isSigner: true, isWritable: false }, // La cuenta del usuario
      { pubkey: userTokenAccount, isSigner: false, isWritable: true }, // La cuenta de tokens del usuario
      { pubkey: contractTokenAccount, isSigner: false, isWritable: true }, // La cuenta de tokens del contrato
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // El programa de tokens SPL
    ],
    programId: contractPublicKey, // El contrato inteligente (programa) a interactuar
    data, // Los datos codificados que el contrato espera
  });

  // Construir la transacción
  const transaction = new Transaction().add(instruction);

  // Asignar el `recentBlockhash` y `feePayer`
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  transaction.feePayer = senderPublicKey;

  // Serializar la transacción
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });

  return bs58.encode(serializedTransaction);
};

export { buildTransaction };