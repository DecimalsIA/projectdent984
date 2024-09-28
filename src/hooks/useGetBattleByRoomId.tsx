import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface Battle {
  roomId: string;
  acceptances: any; // Dependiendo de la estructura que tengas para acceptances
  timestamp: Date;
  // Otros campos de la batalla que puedas tener
}

const useGetBattleByRoomId = () => {
  const [battle, setBattle] = useState<Battle | null>(null); // Almacena la batalla recuperada
  const [loading, setLoading] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null); // Para almacenar el roomId actual

  // Función que buscará la batalla en Firestore por roomId
  const getBattleByRoomId = async (roomId: string): Promise<Battle | null> => {
    // Verificar si ya se ha cargado una batalla para este roomId o si el roomId no ha cambiado
    if (roomId === currentRoomId && battle) return battle;

    setLoading(true);
    try {
      // Crear una referencia al documento usando roomId como ID
      const docRef = doc(db, 'battleParticipants', roomId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Devolver y guardar la batalla encontrada
        const battleDoc = docSnap.data() as Battle;
        setBattle(battleDoc);
        setCurrentRoomId(roomId); // Actualizar el roomId actual
        return battleDoc;
      } else {
        return null; // No se encontró el documento con ese roomId
      }
    } catch (error) {
      console.error('Error al obtener la batalla:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getBattleByRoomId, battle, loading };
};

export default useGetBattleByRoomId;
