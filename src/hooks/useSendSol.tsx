import { useCallback } from 'react';
import { createTransferTransaction } from '@/utils/transactions/createTransferTransaction';
import { signAndSendTransaction } from '@/utils/signAndSendTransaction';
import { PublicKey } from '@solana/web3.js';

export const useSendSol = () => {
  // Función para generar el deeplink
  const getSendSolUrl = useCallback(
    async (
      userId: string,
      { to, lamports }: { to: string; lamports: number },
    ): Promise<string> => {
      try {
        const toPubkey = new PublicKey(to);

        // Aquí solo pasas toPubkey y lamports, sin fromPubkey
        const sendSolUrl = await signAndSendTransaction(userId, () =>
          createTransferTransaction({
            toPubkey,
            lamports,
            userId,
          }),
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
