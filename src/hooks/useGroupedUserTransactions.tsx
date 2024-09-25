import { useState, useEffect } from 'react';
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

interface UserTransaction {
  userId: string;
  count: number;
  nomTlram: string | null; // El nombre de usuario en lugar de 'username'
}

const useGroupedUserTransactions = (): UserTransaction[] => {
  const [userTransactions, setUserTransactions] = useState<UserTransaction[]>(
    [],
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Crear una consulta a la colección 'explore_transaccion'
        const transQuery = query(collection(db, 'explore_transaccion'));

        const querySnapshot = await getDocs(transQuery);

        // Crear un mapa para contar las transacciones por usuario
        const userTransactionMap: { [userId: string]: number } = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId;

          // Incrementar el conteo para cada userId
          if (userTransactionMap[userId]) {
            userTransactionMap[userId]++;
          } else {
            userTransactionMap[userId] = 1;
          }
        });

        // Ahora buscamos en la colección 'USERS' usando el filtro 'userId'
        const userTransactionsPromises = Object.keys(userTransactionMap).map(
          async (userId) => {
            const usersQuery = query(
              collection(db, 'USERS'),
              where('idUser', '==', userId), // Filtrar por userId
            );
            const userSnap = await getDocs(usersQuery);

            let nomTlram = null;
            if (!userSnap.empty) {
              // Obtenemos el primer documento, ya que el 'userId' debe ser único
              const userDoc = userSnap.docs[0];
              nomTlram = userDoc.data().nomTlram;
            }

            return {
              userId,
              count: userTransactionMap[userId],
              nomTlram, // Ahora usamos 'nomTlram'
            };
          },
        );

        // Ejecutar todas las promesas y establecer el estado
        const userTransactionsData = await Promise.all(
          userTransactionsPromises,
        );
        setUserTransactions(userTransactionsData);
      } catch (error) {
        console.error('Error fetching user transactions: ', error);
      }
    };

    fetchTransactions();
  }, []);

  return userTransactions;
};

export default useGroupedUserTransactions;
