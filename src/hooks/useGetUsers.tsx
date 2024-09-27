import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface User {
  idUser: string;
  nomTlram: string; // El campo que estás buscando en el usuario
  // Otros campos que pueda tener el usuario
}

const useGetUserById = () => {
  const [user, setUser] = useState<User | null>(null); // Almacena el usuario recuperado
  const [loading, setLoading] = useState(false);

  // Función que buscará el usuario en Firestore, pero solo si no ha sido cargado ya
  const getUserById = async (userId: string): Promise<User | null> => {
    if (!userId || user) return user; // Si ya hay un usuario cargado o no hay userId, no hacer la consulta

    setLoading(true);
    try {
      // Crear una referencia a la colección 'USERS' y filtrar por 'idUser'
      const q = query(collection(db, 'USERS'), where('idUser', '==', userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Devolver y guardar el primer usuario encontrado
        const userDoc = querySnapshot.docs[0].data() as User;
        setUser(userDoc);
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

  return { getUserById, user, loading };
};

export default useGetUserById;
