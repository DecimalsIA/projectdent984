import useGetUserById from '@/hooks/useGetUsers';
import React, { useEffect, useState } from 'react';

interface UserComponentProps {
  userId2: string; // El ID del usuario que quieres buscar
}

const UserComponent = ({ userId2 }: UserComponentProps) => {
  const [user, setUser] = useState<any>(null);
  const { getUserById } = useGetUserById();

  useEffect(() => {
    const fetchUser = async () => {
      if (userId2) {
        const foundUser = await getUserById(userId2); // Llamar a la función asincrónica
        setUser(foundUser); // Guardar el usuario en el estado
      }
    };

    fetchUser(); // Ejecutar la búsqueda al cargar el componente
  }, [userId2, getUserById]); // Efecto se ejecuta cuando cambia userId2

  return (
    <div className="text">
      {user ? <p>{user.nomTlram}</p> : <p>Loading user name...</p>}
    </div>
  );
};

export default UserComponent;
