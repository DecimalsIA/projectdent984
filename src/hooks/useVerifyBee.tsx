import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';

const useVerifyBee = (userId: string) => {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Crear una referencia a la colección 'phantomConnections' y filtrar por 'userId'
    const q = query(collection(db, 'BEES'), where('userId', '==', userId));

    // Suscribirse a los cambios en la colección
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        setExists(true);
      } else {
        setExists(false);
      }
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, [userId]);

  return exists;
};

export default useVerifyBee;
