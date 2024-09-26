import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
const WS = process.env.NEXT_PUBLIC_WS_URL;
console.log('WS', WS);
const useSocket = (eventName: string) => {
  const [eventReceived, setEventReceived] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!WS) {
      console.error('WebSocket URL is not defined');
      return;
    }

    const socketInstance = io(WS); // Cambia esto por la URL de tu servidor de Socket.IO

    setSocket(socketInstance);

    // Escuchar el evento
    socketInstance.on(eventName, (receivedData) => {
      setEventReceived(true); // Actualiza el estado a true cuando se recibe el evento
      setData(receivedData); // Guarda los datos recibidos del evento
    });

    // Limpiar cuando el componente se desmonte
    return () => {
      socketInstance.off(eventName);
      socketInstance.disconnect();
    };
  }, [eventName]);

  return { eventReceived, data, socket };
};

export default useSocket;
