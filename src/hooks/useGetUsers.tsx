import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface User {
  idUser: string;
  nomTlram: string; // El campo que estás buscando en el usuario
  // Otros campos que pueda tener el usuario
}

const useGetUserById = () => {
  const [loading, setLoading] = useState(false);

  // Función que buscará el usuario en Firestore
  const getUserById = async (userId: string): Promise<User | null> => {
    if (!userId) return null;

    setLoading(true);
    try {
      // Crear una referencia a la colección 'USERS' y filtrar por 'idUser'
      const q = query(collection(db, 'USERS'), where('idUser', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Devolver el primer usuario encontrado
        const userDoc = querySnapshot.docs[0].data() as User;
        return userDoc;
      } else {
        return null; // No se encontró el usuario
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getUserById, loading };
};

export default useGetUserById;
