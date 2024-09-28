import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import SelectBeeContainer from './Battle/SelectBeeContainer';
import PrimaryOptionsOff from './Battle/PrimaryOptionsOff';
import PrimaryOptionsOn from './Battle/PrimaryOptionsOn';
import BodyContainer from './Battle/BodyContainer';

const TURN_DURATION = 50000; // Duración del turno en milisegundos (50 segundos)
const WS =
  process.env.NEXT_PUBLIC_WS_URL || 'https://ws-server-pambii.onrender.com';

const BattleComponent = ({
  userId,
  battleData,
}: {
  userId: any;
  battleData: any;
}) => {
  const [isMyTurn, setIsMyTurn] = useState(battleData?.inicialTurn === userId); // Inicialmente no es el turno del jugador
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION / 1000); // Estado para el temporizador de cada turno
  const [roomId, setRoomId] = useState<string | null>(null);
  const [dataBee, setDataBee] = useState<any>({});
  const [opponentBee, setOpponentBee] = useState<any>({}); // Almacena la abeja del oponente
  const [life, setLife] = useState(500); // Vida inicial del jugador
  const [opponentLife, setOpponentLife] = useState(500); // Vida inicial del oponente
  const [isConnected, setIsConnected] = useState(false); // Estado de la conexión

  // Usamos useRef para mantener la instancia del socket
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    setIsMyTurn(battleData?.inicialTurn === userId);
    // Inicializar socket solo una vez
    socketRef.current = io(WS);

    socketRef.current.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO:', socketRef.current?.id);
      setIsConnected(true); // Cambiar el estado de conexión
    });

    socketRef.current.on('disconnect', () => {
      console.log('Desconectado del servidor de Socket.IO');
      setIsConnected(false); // Cambiar el estado de conexión
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Error al conectar con Socket.IO:', error);
      setIsConnected(false); // Cambiar el estado de conexión en caso de error
    });

    // Escuchar el cambio de turno desde el servidor
    socketRef.current.on('turn-change', ({ turn }) => {
      console.log('turn', turn);
      setIsMyTurn(turn === userId); // Actualiza el estado del turno
      setTimeLeft(TURN_DURATION / 1000); // Reiniciar el temporizador
    });

    // Escuchar actualizaciones de acción desde el servidor
    socketRef.current.on('battle-action', ({ idUser, action, bee, damage }) => {
      console.log(
        `Acción recibida de ${idUser}: ${action}, Daño causado: ${damage}`,
      );

      if (idUser !== userId) {
        setOpponentLife((prevLife) => Math.max(prevLife - damage, 0)); // Actualiza la vida del oponente
        setOpponentBee(bee); // Actualiza los datos de la abeja del oponente
      } else {
        setLife((prevLife) => Math.max(prevLife - damage, 0)); // Actualiza la vida del jugador
        setDataBee(bee); // Actualiza los datos de la abeja del jugador
      }
    });

    // Escuchar cuando la batalla termina
    socketRef.current.on('battle-ended', ({ winner, loser, message }) => {
      console.log(message);
      alert(`La batalla ha terminado. Ganador: ${winner}, Perdedor: ${loser}`);
    });

    // Limpiar eventos cuando el componente se desmonte
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off('connect');
      socketRef.current?.off('disconnect');
      socketRef.current?.off('connect_error');
      socketRef.current?.off('turn-change');
      socketRef.current?.off('battle-action');
      socketRef.current?.off('battle-ended');
    };
  }, [battleData?.roomId, userId]);

  const handleAttack = (selectedAbility: any) => {
    console.log('selectedAbility', roomId && isMyTurn);
    console.log('isMyTurn', isMyTurn);
    console.log('roomId', roomId);
    if (roomId && isMyTurn) {
      // Emitir el evento 'battle-action' con la habilidad seleccionada y otros datos relevantes
      socketRef.current?.emit('battle-action', {
        roomId,
        action: 'attack',
        idUser: userId,
        bee: dataBee,
        ability: selectedAbility,
      });

      // Emitir el evento para cambiar de turno
      socketRef.current?.emit('turn-change', {
        roomId,
        turn:
          battleData?.acceptances?.idUser1 === userId
            ? battleData?.acceptances?.idUser2
            : battleData?.acceptances?.idUser1,
      });

      setTimeLeft(TURN_DURATION / 1000);
      setIsMyTurn(false);
    }
  };

  // Procesamiento de los datos de las abejas de ambos jugadores
  const dataUser1: any = battleData?.acceptances?.bee1[0]?.parts?.reduce(
    (acc: any, part: any) => {
      acc[part.namePart] = part;
      return acc;
    },
    {},
  );

  const dataUser2: any = battleData?.acceptances?.bee2[0]?.parts?.reduce(
    (acc: any, part: any) => {
      acc[part.namePart] = part;
      return acc;
    },
    {},
  );

  return (
    <div className="gamefot">
      <BodyContainer />
      {battleData && (
        <>
          <SelectBeeContainer
            dataUser1={dataUser1}
            dataUser2={dataUser2}
            userId2={battleData?.acceptances?.idUser2}
            userId1={battleData?.acceptances?.idUser1}
          />
          <div className="foter-g">
            <p>
              {isConnected
                ? 'Conectado a Socket.IO'
                : 'Desconectado de Socket.IO'}
            </p>
            {isMyTurn ? (
              <PrimaryOptionsOn
                dataBee={
                  battleData?.acceptances?.idUser1 === userId
                    ? battleData?.acceptances?.bee1[0]
                    : battleData?.acceptances?.bee2[0]
                }
                life={life}
                timeLeft={timeLeft}
                onAttack={handleAttack}
              />
            ) : (
              <PrimaryOptionsOff timeLeft={timeLeft} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BattleComponent;
