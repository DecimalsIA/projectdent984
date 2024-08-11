import { useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  getAccount,
  getAssociatedTokenAddress,
  Account,
} from '@solana/spl-token';
import { getDocumentByUserId } from '@/utils/getDocumentByUserId';

const connection = new Connection('https://api.devnet.solana.com'); // Cambia a la red que estás usando

export const useAccountInfoToken = (id: string) => {
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        setLoading(true);
        const { publicKey } = await getDocumentByUserId(id);
        const token = 'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ';
        const userPublicKey = new PublicKey(publicKey);
        const tokenMintAddress = new PublicKey(token); // Cambia por la dirección del token SPL

        // Obtener la dirección de la cuenta asociada del token para el usuario
        const associatedTokenAddress = await getAssociatedTokenAddress(
          tokenMintAddress,
          userPublicKey,
        );

        // Obtener la información de la cuenta
        const accountInfo = await getAccount(
          connection,
          associatedTokenAddress,
        );
        console.log('accountInfo', accountInfo);

        // Guardar la información en el estado
        setAccountInfo(accountInfo);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAccountInfo();
    }
  }, [id]);

  return { accountInfo, loading, error };
};
