import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface User {
  idUser: string;
  // Otros campos que pueda tener el usuario
}

const useGetUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Crear una referencia a la colección 'USERS' y filtrar por 'userId'
    const q = query(collection(db, 'USERS'), where('idUser', '==', userId));

    // Suscribirse a los cambios en la colección
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const firstUser = querySnapshot.docs[0].data() as User; // Tomar el primer usuario que coincida
        setUser(firstUser);
        setExists(true);
      } else {
        setUser(null);
        setExists(false);
      }
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, [userId]);

  return { exists, user };
};

export default useGetUser;
