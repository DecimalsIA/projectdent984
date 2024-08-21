import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer | undefined;

export const initializeSocket = (server: HttpServer) => {
  if (!io) {
    console.log('Inicializando Socket.IO...');
    io = new SocketIOServer(server, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado:', socket.id);

      socket.on('find-match', (data) => {
        console.log('Datos de matchmaking recibidos:', data);
      });

      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
      });
    });
  }
  return io;
};

export const getSocketInstance = () => {
  if (!io) {
    throw new Error('Socket.IO no ha sido inicializado');
  }
  return io;
};
