import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import SelectBeeContainer from './Battle/SelectBeeContainer';
import PrimaryOptionsOff from './Battle/PrimaryOptionsOff';
import PrimaryOptionsOn from './Battle/PrimaryOptionsOn';
import BodyContainer from './Battle/BodyContainer';
import useBattleActions from '@/hooks/useBattleActions';

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
  const [roomId, setRoomId] = useState<string | null>(null);
  const [dataBee, setDataBee] = useState<any>({});
  const [opponentBee, setOpponentBee] = useState<any>({});
  const [life, setLife] = useState(500);
  const [opponentLife, setOpponentLife] = useState(500);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (battleData?.roomId) {
      setRoomId(battleData.roomId);
    }

    socketRef.current = io(WS);

    socketRef.current.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO:', socketRef.current?.id);
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Desconectado del servidor de Socket.IO');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Error al conectar con Socket.IO:', error);
      setIsConnected(false);
    });

    socketRef.current.on('turn-change', ({ turn }) => {
      console.log('turn-change recibido:', turn);
      // setIsMyTurn(turn === userId);
      // setTimeLeft(TURN_DURATION / 1000);
    });

    socketRef.current.on('battle-action', ({ idUser, action, bee, damage }) => {
      console.log(
        `Acción recibida de ${idUser}: ${action}, Daño causado: ${damage}`,
      );

      if (idUser !== userId) {
        setOpponentLife((prevLife) => Math.max(prevLife - damage, 0));
        setOpponentBee(bee);
      } else {
        setLife((prevLife) => Math.max(prevLife - damage, 0));
        setDataBee(bee);
      }
    });

    socketRef.current.on('battle-ended', ({ winner, loser, message }) => {
      console.log(message);
      alert(`La batalla ha terminado. Ganador: ${winner}, Perdedor: ${loser}`);
    });

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

  // Usamos el hook personalizado para manejar las acciones de batalla
  const { handleAttack, isMyTurn, timeLeft } = useBattleActions({
    socket: socketRef.current,
    roomId,
    userId,
    dataBee,
    battleData,
  });

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
