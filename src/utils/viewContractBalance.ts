import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount, TokenAccountNotFoundError } from '@solana/spl-token'; // Importar getAccount de spl-token
import * as anchor from "@project-serum/anchor";
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import idl from './pambii_explorer.json'; // Tu IDL

const viewContractBalance = async (
  contractTokenAddress: PublicKey, // Dirección de la cuenta de tokens del contrato
  connection: Connection,
  programId: PublicKey
): Promise<string | null> => {
  // Establecer el proveedor para interactuar con el contrato
  const provider = new AnchorProvider(connection, {} as any, AnchorProvider.defaultOptions());
  const program = new Program(idl as Idl, programId, provider);

  try {
    // Usar getAccount para obtener la información de la cuenta de tokens SPL
    const tokenAccountInfo = await getAccount(connection, contractTokenAddress);

    // Retornar el saldo en formato legible
    return tokenAccountInfo.amount.toString(); // El saldo está en la propiedad `amount`
  } catch (error) {
    if (error instanceof TokenAccountNotFoundError) {
      console.error("La cuenta de tokens no fue encontrada:", error);
    } else {
      console.error("Error al obtener el balance del contrato:", error);
    }
    return null;
  }
};

export { viewContractBalance };
