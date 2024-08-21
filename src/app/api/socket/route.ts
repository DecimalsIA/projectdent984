// app/api/socket/route.ts
import { Server as SocketIOServer } from 'socket.io';
import { NextRequest, NextResponse } from 'next/server';
import { Server as HttpServer } from 'http';
import { initializeSocket } from '@/utils/socket';

let io: SocketIOServer;

export async function GET(req: NextRequest) {
  if (!io) {
    const httpServer = req.nextUrl;

    // Configura el servidor Socket.IO
    io = new SocketIOServer(httpServer as unknown as HttpServer, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado:', socket.id);

      // Lógica de matchmaking
      socket.on('find-match', async (data) => {
        // Lógica para buscar una coincidencia en Firebase
      });

      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
      });
    });
  }

  return NextResponse.json({ message: 'Socket server ready' });
}
