/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { viewContractBalance } from '@/utils/viewContractBalance';
// Asegúrate de tener la ruta correcta

const useContractBalance = () => {
  const connection = new Connection('https://api.devnet.solana.com');
  const programId = new PublicKey(
    '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe',
  ); // Tu programId
  const contractTokenAddress = new PublicKey(
    'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ',
  );

  // Estados para el balance, carga y error
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true); // Comienza el proceso de carga
        const fetchedBalance = await viewContractBalance(
          contractTokenAddress,
          connection,
          programId,
        );
        setBalance(fetchedBalance); // Almacenar el balance obtenido
        setError(null); // Limpiar cualquier error previo
      } catch (err) {
        console.error('Error fetching contract balance:', err);
        setError('Error fetching balance');
        setBalance(null);
      } finally {
        setLoading(false); // Finaliza el proceso de carga
      }
    };

    fetchBalance();
  }, [contractTokenAddress, connection, programId]); // Se ejecuta cada vez que uno de estos parámetros cambie

  return { balance, loading, error };
};

export default useContractBalance;
