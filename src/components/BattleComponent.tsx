import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import SelectBeeContainer from './Battle/SelectBeeContainer';
import PrimaryOptionsOff from './Battle/PrimaryOptionsOff';
import PrimaryOptionsOn from './Battle/PrimaryOptionsOn';
import BodyContainer from './Battle/BodyContainer';

const TURN_DURATION = 50000; // Duración del turno en milisegundos (50 segundos)
const WS =
  process.env.NEXT_PUBLIC_WS_URL || 'https://ws-server-pambii.onrender.com';
// Conectar con el servidor de Socket.IO
const socket = io(WS); // Cambia la URL por la de tu servidor

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

  useEffect(() => {
    // Establecer roomId a partir de battleData cuando se cargue la batalla
    setRoomId(battleData?.roomId);
    setIsMyTurn(battleData?.inicialTurn === userId);
    if (battleData?.acceptances?.idUser1 === userId) {
      setDataBee(battleData?.acceptances?.bee1[0]);
    }
    if (battleData?.acceptances?.idUser2 === userId) {
      setDataBee(battleData?.acceptances?.bee2[0]);
    }

    // Escuchar el cambio de turno desde el servidor
    socket.on('turn-change', ({ turn }) => {
      setIsMyTurn(turn === userId); // Actualiza el estado del turno
      setTimeLeft(TURN_DURATION / 1000); // Reiniciar el temporizador
    });

    // Temporizador de cuenta regresiva por cada turno
    const countdown = setInterval(() => {
      setTimeLeft((prevTimeLeft) => (prevTimeLeft > 0 ? prevTimeLeft - 1 : 0));
    }, 1000);

    // Limpiar los eventos y temporizadores cuando el componente se desmonte
    return () => {
      clearInterval(countdown);
      socket.off('turn-change');
    };
  }, [battleData?.roomId, userId]);

  const handleAction = (action: string, bee: any) => {
    if (roomId && isMyTurn) {
      // Emitir acción de batalla al servidor
      socket.emit('battle-action', { roomId, action, idUser: userId, bee });
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
            {true ? (
              <PrimaryOptionsOn dataBee={dataBee} timeLeft={timeLeft} />
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
