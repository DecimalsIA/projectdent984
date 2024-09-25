import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface ExplorationResult {
  userId: string;
  wins: number;
  losses: number;
}

const useGroupedExplorationResults = (): ExplorationResult[] => {
  const [explorationResults, setExplorationResults] = useState<
    ExplorationResult[]
  >([]);

  useEffect(() => {
    const fetchExplorations = async () => {
      try {
        // Crear una consulta a la colección 'explore_transaccion'
        const transQuery = query(collection(db, 'explore_transaccion'));

        const querySnapshot = await getDocs(transQuery);

        // Crear un mapa para contar las victorias y derrotas por usuario
        const userResultMap: {
          [userId: string]: { wins: number; losses: number };
        } = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const userId = data.userId;
          const explorationPlay = data.explorationPlay;

          if (!userResultMap[userId]) {
            userResultMap[userId] = { wins: 0, losses: 0 };
          }

          // Incrementar las victorias o derrotas según el valor de explorationPlay
          if (explorationPlay === 'win') {
            userResultMap[userId].wins++;
          } else if (explorationPlay === 'loss') {
            userResultMap[userId].losses++;
          }
        });

        // Convertir el mapa a un array y ordenar por mayor número de victorias
        const sortedResults = Object.keys(userResultMap)
          .map((userId) => ({
            userId,
            wins: userResultMap[userId].wins,
            losses: userResultMap[userId].losses,
          }))
          .sort((a, b) => {
            // Ordenar por mayor número de victorias, luego por menor número de derrotas
            if (a.wins !== b.wins) {
              return b.wins - a.wins; // Mayor número de victorias primero
            }
            return a.losses - b.losses; // Menor número de derrotas después
          });

        setExplorationResults(sortedResults);
      } catch (error) {
        console.error('Error fetching exploration results: ', error);
      }
    };

    fetchExplorations();
  }, []);

  return explorationResults;
};

export default useGroupedExplorationResults;
