const express = require('express');
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const WS = process.env.NEXT_PUBLIC_WS_URL;
console.log('WS', WS);
const app = next({ dev });
const handle = app.getRequestHandler();

const matchQueue = []; // Cola para los jugadores que buscan un match
const roomTurn = {}; // Estado del turno en cada sala

app.prepare().then(() => {
  const expressApp = express();
  const server = createServer(expressApp);

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    socket.on('find-match', async ({ idUser, arena, bee }) => {
      const existingPlayer = matchQueue.find(
        (player) => player.idUser === idUser,
      );

      if (existingPlayer) {
        console.log(`El jugador ${idUser} ya está en la cola.`);
        return;
      }

      const match = matchQueue.find(
        (player) => player.arena === arena && player.idUser !== idUser,
      );

      if (match) {
        console.log(`Coincidencia encontrada: ${idUser} vs ${match.idUser}`);

        // Crear una sala única para los dos jugadores
        const roomId = `room-${idUser}-${match.idUser}`;
        socket.join(roomId);
        io.to(match.socketId).socketsJoin(roomId);

        // Asignar el turno inicial al jugador A (el primer jugador)
        roomTurn[roomId] = idUser; // Asignar el turno inicial al primer jugador

        io.to(socket.id).emit('match-found', {
          idUser1: idUser,
          idUser2: match.idUser,
          roomId,
        });
        io.to(match.socketId).emit('match-found', {
          idUser1: idUser,
          idUser2: match.idUser,
          roomId,
        });

        // Iniciar la batalla y notificar a ambos jugadores quién tiene el primer turno
        io.to(roomId).emit('start-battle', {
          message: 'Batalla iniciada',
          turn: roomTurn[roomId],
        });

        // Eliminar a ambos jugadores de la cola
        matchQueue.splice(matchQueue.indexOf(match), 1);
      } else {
        matchQueue.push({ idUser, arena, bee, socketId: socket.id });
        socket.emit('waiting');
      }
    });

    let acceptances = {}; // Para rastrear cuántos jugadores han aceptado

    socket.on('accept-match', ({ roomId, idUser }) => {
      if (!acceptances[roomId]) {
        acceptances[roomId] = { accepted: 0, players: [] };
      }

      acceptances[roomId].accepted += 1;
      acceptances[roomId].players.push(idUser);

      if (acceptances[roomId].accepted === 2) {
        console.log(
          `Ambos jugadores aceptaron en la sala ${roomId}. Iniciando la batalla.`,
        );
        io.to(roomId).emit('start-battle', {
          message: 'Batalla iniciada',
          turn: roomTurn[roomId],
        });
      }
    });

    socket.on('battle-action', ({ roomId, action, idUser }) => {
      // Verificar si es el turno del jugador
      if (roomTurn[roomId] !== idUser) {
        socket.emit('not-your-turn', { message: 'No es tu turno' });
        return;
      }

      console.log(
        `Acción de batalla de ${idUser} en la sala ${roomId}:`,
        action,
      );
      io.to(roomId).emit('action-update', { idUser, action });

      // Cambiar el turno al otro jugador después de la acción
      const currentPlayers = acceptances[roomId].players;
      roomTurn[roomId] = currentPlayers.find((player) => player !== idUser);

      // Notificar a los jugadores sobre el cambio de turno
      io.to(roomId).emit('turn-change', { turn: roomTurn[roomId] });
    });

    socket.on('cancel-match', ({ roomId, idUser }) => {
      console.log(`${idUser} canceló el match en la sala ${roomId}`);
      socket.leave(roomId);
      io.to(roomId).emit('match-cancelled', {
        message: `${idUser} ha cancelado la batalla`,
      });
      delete acceptances[roomId];
      delete roomTurn[roomId];
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
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
    console.log('> Ready ', WS);
  });
});
