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
  const [opponentBee, setOpponentBee] = useState<any>({}); // Almacena la abeja del oponente
  const [life, setLife] = useState(500); // Vida inicial del jugador
  const [opponentLife, setOpponentLife] = useState(500); // Vida inicial del oponente

  useEffect(() => {
    // Establecer roomId a partir de battleData cuando se cargue la batalla
    setRoomId(battleData?.roomId);
    setIsMyTurn(battleData?.inicialTurn === userId);

    // Establecer los datos de la abeja del usuario y del oponente
    if (battleData?.acceptances?.idUser1 === userId) {
      setDataBee(battleData?.acceptances?.bee1[0]);
      setOpponentBee(battleData?.acceptances?.bee2[0]);
    } else if (battleData?.acceptances?.idUser2 === userId) {
      setDataBee(battleData?.acceptances?.bee2[0]);
      setOpponentBee(battleData?.acceptances?.bee1[0]);
    }

    // Escuchar el cambio de turno desde el servidor
    socket.on('turn-change', ({ turn }) => {
      setIsMyTurn(turn === userId); // Actualiza el estado del turno
      setTimeLeft(TURN_DURATION / 1000); // Reiniciar el temporizador
    });

    // Escuchar actualizaciones de acción desde el servidor
    socket.on('action-update', ({ idUser, action, bee, damage }) => {
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
    socket.on('battle-ended', ({ winner, loser, message }) => {
      console.log(message);
      alert(`La batalla ha terminado. Ganador: ${winner}, Perdedor: ${loser}`);
      // Aquí puedes agregar lógica para resetear el juego o redirigir
    });

    // Temporizador de cuenta regresiva por cada turno
    const countdown = setInterval(() => {
      setTimeLeft((prevTimeLeft) => (prevTimeLeft > 0 ? prevTimeLeft - 1 : 0));
    }, 1000);

    // Limpiar los eventos y temporizadores cuando el componente se desmonte
    return () => {
      clearInterval(countdown);
      socket.off('turn-change');
      socket.off('action-update');
      socket.off('battle-ended');
    };
  }, [battleData?.roomId, userId]);

  const handleAttack = (selectedAbility: any) => {
    console.log(
      'Selected ability for attack:',
      selectedAbility,
      roomId,
      opponentLife,
    );

    if (roomId && isMyTurn) {
      // Emitir el evento 'battle-action' con la habilidad seleccionada y otros datos relevantes
      socket.emit('battle-action', {
        roomId, // ID de la sala
        action: 'attack', // Acción realizada
        idUser: userId, // ID del usuario actual
        bee: dataBee, // Datos de la abeja seleccionada
        ability: selectedAbility, // Habilidad seleccionada
      });
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
            {isMyTurn ? (
              <PrimaryOptionsOn
                dataBee={dataBee} // Pasa la abeja del jugador
                life={life} // Pasa la vida actual del jugador
                timeLeft={timeLeft}
                onAttack={handleAttack} // Pasamos la función handleAttack
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
