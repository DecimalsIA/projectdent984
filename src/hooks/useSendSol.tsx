import { PublicKey } from '@solana/web3.js';
import {
  createTransferTransaction,
  TransferParams,
} from '@/utils/transactions/createTransferTransaction';
import { signAndSendTransaction } from '@/utils/signAndSendTransaction';
import { useCallback } from 'react';

export const useSendSol = () => {
  // Función para obtener la URL de envío de SOL
  const getSendSolUrl = useCallback(
    async (
      userId: string,
      { to, lamports }: { to: string; lamports: number },
    ): Promise<string> => {
      try {
        // Crear la clave pública de destino
        const toPubkey = new PublicKey(to);

        // Crear los parámetros de transacción
        const transferParams: TransferParams = {
          toPubkey,
          lamports,
        };

        // Obtener la transacción a partir de los parámetros
        const transactionPromise = await createTransferTransaction(
          transferParams,
        );

        // Pasar la función que crea la transacción a `signAndSendTransaction`
        const sendSolUrl = await signAndSendTransaction(
          userId,
          transactionPromise,
        );

        return sendSolUrl; // Retorna la URL generada
      } catch (error) {
        console.error('Error al generar la URL de envío de SOL:', error);
        return ''; // Retorna un string vacío si hay un error
      }
    },
    [],
  );

  return {
    getSendSolUrl,
  };
};
