const express = require('express');
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const axios = require('axios');

const dev = process.env.NODE_ENV !== 'production';
const WS = process.env.NEXT_PUBLIC_WS_URL;
console.log('WS', WS);
const app = next({ dev });
const handle = app.getRequestHandler();

const matchQueue = []; // Cola para almacenar los jugadores que buscan una coincidencia
const fetchBees = async (userIds, idbees) => {
  try {
    const queryParams = userIds
      .map((userId, index) => `userId=${userId}&idbee=${idbees[index]}`)
      .join('&');
    const url = `${WS}/api/getBeeVSbattle?${queryParams}`;
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {},
    };

    // Esperamos la respuesta de la solicitud
    const response = await axios.request(config);

    // Retornamos la data de la respuesta
    return response.data;
  } catch (error) {
    // Capturamos y mostramos cualquier error
    console.error('Error fetching data:', error);

    // Lanzamos el error para que sea manejado por quien llame la función
    throw error;
  }
};
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

    socket.on('find-match', async ({ idUser, arena, bee }) => {
      console.log(`Recibido find-match para ${idUser} en la arena ${arena}`);

      // Verificar si el jugador ya está en la cola
      const existingPlayer = matchQueue.find(
        (player) => player.idUser === idUser,
      );

      if (existingPlayer) {
        console.log(
          `El jugador ${idUser} ya está en la cola o ya tiene coincidencia.`,
        );
        return; // Salir si el jugador ya está en la cola
      }

      // Lógica de matchmaking: buscar una coincidencia en la cola
      const match = matchQueue.find(
        (player) => player.arena === arena && player.idUser !== idUser,
      );

      if (match) {
        // Coincidencia encontrada, enviar el evento 'match-found' a ambos jugadores
        console.log('match', match);
        console.log(`Coincidencia encontrada: ${idUser} vs ${match.idUser}`);
        console.log(`Coincidencia Abejas: ${bee} vs ${match.bee}`);
        const data = await fetchBees([idUser, match.idUser], [bee, match.bee]);

        // COnsultamos la abeja
        io.to(socket.id).emit('match-found', {
          idUser1: idUser,
          user1Bee: bee,
          idUser2: match.idUser,
          user2Bee: match.bee,
          data,
          arena,
        });
        io.to(match.socketId).emit('match-found', {
          idUser1: idUser,
          user1Bee: bee,
          idUser2: match.idUser,
          user2Bee: match.bee,
          data,
          arena,
        });
        io.to(match.socketId).emit('battle', {
          data,
          arena,
        });

        // Eliminar jugadores de la cola
        matchQueue.splice(matchQueue.indexOf(match), 1);
      } else {
        // No se encuentra coincidencia, añadir a la cola
        console.log(
          `No se encuentra coincidencia, agregando ${idUser} a la cola`,
        );
        matchQueue.push({ idUser, arena, bee, socketId: socket.id });
        socket.emit('waiting');
      }
    });

    socket.on('accept-match', () => {
      console.log('usuario accept-match:', socket.id);
    });
    socket.on('cancel-match', () => {
      console.log('usuario cancel-match:', socket.id);
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
    console.log('> Ready ', WS);
  });
});
