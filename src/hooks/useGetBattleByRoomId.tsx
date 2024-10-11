/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
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

  // Función que suscribirá a la batalla en Firestore por roomId
  const subscribeToBattleByRoomId = (roomId: string) => {
    // Si el roomId no ha cambiado, no volver a suscribirse
    if (roomId === currentRoomId) return;

    setLoading(true);
    setCurrentRoomId(roomId); // Actualizar el roomId actual

    // Crear una referencia al documento usando roomId como ID
    const docRef = doc(db, 'battleParticipants', roomId);

    // Escuchar los cambios en tiempo real del documento
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          // Actualizar el estado de la batalla con los datos encontrados
          const battleDoc = docSnap.data() as Battle;
          setBattle(battleDoc);
        } else {
          // Si no existe el documento, establecer la batalla como null
          setBattle(null);
        }
        setLoading(false); // Dejar de mostrar el estado de carga
      },
      (error) => {
        console.error('Error al suscribirse a la batalla:', error);
        setBattle(null);
        setLoading(false);
      },
    );

    // Retornar la función para cancelar la suscripción cuando cambie el roomId
    return unsubscribe;
  };

  useEffect(() => {
    // Limpiar la suscripción previa al cambiar el roomId
    return () => {
      if (currentRoomId) {
        subscribeToBattleByRoomId(currentRoomId); // Cancelar suscripción anterior si es necesario
      }
    };
  }, [currentRoomId]); // Efecto dependiente de cambios en currentRoomId

  return { subscribeToBattleByRoomId, battle, loading };
};

export default useGetBattleByRoomId;
