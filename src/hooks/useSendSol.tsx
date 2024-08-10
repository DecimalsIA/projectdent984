import { PublicKey } from '@solana/web3.js';
import {
  createTransferTransaction,
  TransferParams,
} from '@/utils/transactions/createTransferTransaction';
import { signAndSendTransaction } from '@/utils/signAndSendTransaction';
import { useCallback } from 'react';

export const useSendSol = () => {
  const getSendSolUrl = useCallback(
    async (
      userId: string,
      { to, lamports }: { to: string; lamports: number },
    ): Promise<string> => {
      try {
        const toPubkey = new PublicKey(to);

        // Crear los parámetros de transacción sin 'fromPubkey'
        const transferParams: TransferParams = {
          toPubkey,
          lamports,
          userId,
        };

        // Pasar una función que crea la transacción
        const sendSolUrl = await signAndSendTransaction(
          userId,
          async (params: TransferParams) => createTransferTransaction(params),
          transferParams,
        );
        return sendSolUrl; // Retorna la URL generada
      } catch (error) {
        console.log('Error al generar la url :', error);
        return ''; // Retorna un string vacío si hay un error
      }
    },
    [],
  );

  return {
    getSendSolUrl,
  };
};
