import {
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  Connection,
  SystemProgram,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';



// Reemplaza con los valores proporcionados
const contractPublicKey = new PublicKey('3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe'); // Contract Program ID
const tokenAddress = new PublicKey('HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ'); // SPL Token Address
const tokenProgramId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed'); // Usa la URL de la red en la que estés
// BPFLoaderUpgradeab1e11111111111111111111111

// Construye la instrucción para el método `buyId` en tu contrato
export async function buildBuyIdInstruction(
  userPublicKey: PublicKey, // Usamos PublicKey aquí
  amount: number // Usamos `anchor.BN` para el tipo `u64` en el IDL
): Promise<any> {

  // Obtén la cuenta de token SPL asociada del usuario
  const userTokenAccount = await getAssociatedTokenAddress(tokenAddress, userPublicKey);

  if (!userTokenAccount) {
    throw new Error('User token account not found');
  }

  const dataa = new anchor.BN(amount);
  try {
    // Convierte BN a un array de bytes y luego a Buffer
    const data = Buffer.from(dataa.toArrayLike(Buffer, 'le', 8));
    console.log('amountBuffer', data);
    const contractTokenAccount = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'); // Reemplazar



    const keys = [
      { pubkey: userPublicKey, isSigner: true, isWritable: true },
      { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: contractTokenAccount, isSigner: false, isWritable: true },
      { pubkey: tokenAddress, isSigner: false, isWritable: false },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
      { pubkey: contractPublicKey, isSigner: false, isWritable: false },
    ];



    const instruction = new TransactionInstruction({
      keys,
      programId: contractPublicKey,
      data,
    });

    return instruction
  } catch (error) {
    console.log('Error al convertir el amount a buffer:', error);
  }

}