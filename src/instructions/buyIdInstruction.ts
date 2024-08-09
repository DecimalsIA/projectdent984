import {
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  Connection,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';



// Reemplaza con los valores proporcionados
const PROGRAM_ID = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe'); // Contract Program ID
const SPL_TOKEN_ID = new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ'); // SPL Token Address

const network = 'https://api.devnet.solana.com';
const connection = new Connection(network);

// Obtén la cuenta de token SPL asociada del usuario
async function getUserTokenAccount(
  userPublicKey: PublicKey
): Promise<PublicKey | null> {
  // Obtén la dirección de la cuenta asociada del token SPL para el usuario
  const associatedTokenAddress = await getAssociatedTokenAddress(
    SPL_TOKEN_ID, // Dirección del token SPL (mint address)
    userPublicKey // Dirección del propietario
  );

  try {
    // Verifica si la cuenta existe
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
    if (accountInfo === null) {
      console.log('Account does not exist');
      return null;
    }

    // Retorna la dirección de la cuenta asociada del token SPL
    return associatedTokenAddress;
  } catch (error) {
    console.error('Error fetching token account:', error);
    return null;
  }
}

// Construye la instrucción para el método `buyId` en tu contrato
export async function buildBuyIdInstruction(
  userPublicKey: PublicKey, // Usamos PublicKey aquí
  userAccount: PublicKey | null, // Puede ser null si se necesita crear
  amount: number // Usamos `anchor.BN` para el tipo `u64` en el IDL
): Promise<any> {

  // Obtén la cuenta de token SPL asociada del usuario
  const userToken = await getUserTokenAccount(userPublicKey);

  if (!userToken) {
    throw new Error('User token account not found');
  }

  const dataa = new anchor.BN(amount);
  try {
    // Convierte BN a un array de bytes y luego a Buffer
    const data = Buffer.from(dataa.toArrayLike(Buffer, 'le', 8));
    console.log('amountBuffer', data);

    const keys = [
      { pubkey: userPublicKey, isSigner: true, isWritable: true },
      { pubkey: userAccount ?? PublicKey.default, isSigner: false, isWritable: true },
      { pubkey: userToken, isSigner: false, isWritable: true },
      { pubkey: SPL_TOKEN_ID, isSigner: false, isWritable: false },
      { pubkey: PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ];

    const instruction = new TransactionInstruction({
      keys,
      programId: PROGRAM_ID,
      data,
    });

    return instruction
  } catch (error) {
    console.log('Error al convertir el amount a buffer:', error);
  }

}