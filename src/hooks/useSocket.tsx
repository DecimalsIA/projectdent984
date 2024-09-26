/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

const WS = process.env.NEXT_PUBLIC_WS_URL;

const useSocket = (eventName: string) => {
  const [eventReceived, setEventReceived] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!WS) {
      console.error('WebSocket URL is not defined');
      return;
    }

    // Solo crea una instancia de socket si no hay una ya existente
    const socketInstance = io(WS, {
      reconnectionAttempts: 5, // Intenta reconectar 5 veces si se pierde la conexión
      transports: ['websocket'], // Asegura que se usa WebSocket como transporte
    });

    setSocket(socketInstance);

    // Escuchar el evento
    socketInstance.on(eventName, (receivedData) => {
      setEventReceived(true);
      setData(receivedData);
    });

    // Limpiar cuando el componente se desmonte
    return () => {
      socketInstance.off(eventName); // Desconectar el listener del evento
      socketInstance.disconnect(); // Desconectar el socket
    };
  }, [eventName, WS]); // Solo vuelve a crear el socket si cambia la URL o el nombre del evento

  return { eventReceived, data, socket };
};

export default useSocket;
