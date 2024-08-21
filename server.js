const express = require('express');
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const matchQueue = []; // Cola para almacenar los jugadores que buscan una coincidencia

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);

  // Inicializar Socket.IO con CORS que permite todos los orígenes
  const io = new Server(server, {
    cors: {
      origin: '*', // Permitir todos los orígenes
      methods: ['GET', 'POST'], // Métodos permitidos
    },
  });

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    socket.on('find-match', ({ idUser, arena }) => {
      console.log(`Recibido find-match para ${idUser} en la arena ${arena}`);

      // Lógica de matchmaking: buscar una coincidencia en la cola
      const match = matchQueue.find(
        (player) => player.arena === arena && player.idUser !== idUser,
      );
      console.log('match->', match);
      if (match) {
        // Coincidencia encontrada, enviar el evento 'match-found' a ambos jugadores
        console.log(`Coincidencia encontrada: ${idUser} vs ${match.idUser}`);
        io.to(socket.id).emit('match-found', {
          idUser1: idUser,
          idUser2: match.idUser,
          arena,
        });
        io.to(match.socketId).emit('match-found', {
          idUser1: idUser,
          idUser2: match.idUser,
          arena,
        });

        // Eliminar jugadores de la cola
        matchQueue.splice(matchQueue.indexOf(match), 1);
      } else {
        // No se encuentra coincidencia, añadir a la cola
        console.log(
          `No se encuentra coincidencia, agregando ${idUser} a la cola`,
        );
        matchQueue.push({ idUser, arena, socketId: socket.id });
        socket.emit('waiting');
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
      // Remover jugador de la cola si se desconecta
      const index = matchQueue.findIndex(
        (player) => player.socketId === socket.id,
      );
      if (index !== -1) {
        console.log(`Eliminando a ${matchQueue[index].idUser} de la cola`);
        matchQueue.splice(index, 1);
      }
    });
  });

  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
