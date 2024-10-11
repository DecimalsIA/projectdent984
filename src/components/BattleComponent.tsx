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

  const [isConnected, setIsConnected] = useState(false);
  const [battleResult, setBattleResult] = useState('');
  const [battleResultTypeUser1, setBattleResultTypeUser1] = useState('');
  const [battleResultTypeNumberUser1, setBattleResultTypeNumberUser1] =
    useState(0);

  const [battleResultTypeUser2, setBattleResultTypeUser2] = useState('');
  const [battleResultTypeNumberUser2, setBattleResultTypeNumberUser2] =
    useState(0);

  const socketRef = useRef<Socket | null>(null);

  // Usamos el hook personalizado para manejar las acciones de batalla
  const { handleAttack, isMyTurn, timeLeft, battleOutcome } = useBattleActions({
    socket: socketRef.current,
    roomId,
    userId,
    dataBee,
    battleData,
  });
  const [opponentLife, setOpponentLife] = useState(
    battleData?.acceptances?.idUser1 === userId
      ? battleData?.lifeUser1
      : battleData?.lifeUser2,
  );
  useEffect(() => {
    if (battleOutcome === 'win') {
      console.log('¡Ganaste la batalla!');
      alert('¡Ganaste la batalla!');
    } else if (battleOutcome === 'lose') {
      console.log('Perdiste la batalla');
      alert('Perdiste la batalla!');
    }
  }, [battleOutcome]);

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

    setOpponentLife(
      battleData?.acceptances?.idUser1 === userId
        ? battleData?.lifeUser1
        : battleData?.lifeUser2,
    );

    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off('connect');
      socketRef.current?.off('disconnect');
      socketRef.current?.off('connect_error');
      socketRef.current?.off('turn-change');
      socketRef.current?.off('battle-action');
      socketRef.current?.off('battle-ended');
    };
  }, [
    battleData?.acceptances?.idUser1,
    battleData?.lifeUser1,
    battleData?.lifeUser2,
    battleData?.roomId,
    userId,
  ]);

  useEffect(() => {
    console.log('useEffect isMyTurn', isMyTurn);
  }, [isMyTurn]);

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
  // Para ejecutar un ataque y actualizar la barra de vida:
  const onAttackMe = async (selectedAbility: any) => {
    const opponentLife = await handleAttack(selectedAbility);
    if (opponentLife !== null) {
      // Aquí puedes actualizar la barra de progreso con `opponentLife`
      setOpponentLife(
        battleData?.acceptances?.idUser1 === userId
          ? battleData?.lifeUser1
          : battleData?.lifeUser2,
      );

      if (opponentLife?.result === 'attack') {
        if (battleData?.acceptances?.idUser1 === userId) {
          setBattleResultTypeUser1(opponentLife?.result);
          setBattleResultTypeNumberUser1(opponentLife?.value);
        } else {
          setBattleResultTypeUser2(opponentLife?.result);
          setBattleResultTypeNumberUser2(opponentLife?.value);
        }

        setBattleResult(
          `Ataque realizado con un valor de daño de: ${opponentLife}`,
        );
      } else if (opponentLife?.result === 'defense') {
        setBattleResult(
          `Defensa activada, valor de defensa aplicado: ${opponentLife}`,
        );
        if (battleData?.acceptances?.idUser1 === userId) {
          setBattleResultTypeUser1(opponentLife?.result);
          setBattleResultTypeNumberUser1(opponentLife?.value);
        } else {
          setBattleResultTypeUser2(opponentLife?.result);
          setBattleResultTypeNumberUser2(opponentLife?.value);
        }
      }

      console.log(`La vida del oponente es ahora: ${opponentLife?.value}`);

      setTimeout(() => {
        setBattleResultTypeUser1('');
        setBattleResultTypeNumberUser1(0);
        setBattleResultTypeUser2('');
        setBattleResultTypeNumberUser2(0);
      }, 1300);
      // Actualiza la barra de progreso en tu componente
    }
  };

  console.log('opponentLife', battleData?.lifeUser1);
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
            battleIfoUser1={battleResultTypeUser1}
            battleIfoUser2={battleResultTypeUser2}
            battleIfoUser1Number={battleResultTypeNumberUser1}
            battleIfoUser2Number={battleResultTypeNumberUser2}
            life1={
              battleData?.acceptances?.idUser1 === userId &&
              battleData?.lifeUser1
            }
            life2={
              battleData?.acceptances?.idUser2 === userId
                ? battleData?.lifeUser2
                : battleData?.lifeUser2
            }
          />
          <div className="foter-g">
            {isMyTurn ? (
              <PrimaryOptionsOn
                dataBee={
                  battleData?.acceptances?.idUser1 === userId
                    ? battleData?.acceptances?.bee1[0]
                    : battleData?.acceptances?.bee2[0]
                }
                life={opponentLife}
                timeLeft={timeLeft}
                onAttack={onAttackMe}
                type={
                  battleData?.acceptances?.idUser1 === userId
                    ? battleResultTypeUser1 + '[]' + battleResultTypeUser1
                    : battleResultTypeUser2 + '[]' + battleResultTypeUser2
                }
              />
            ) : (
              <PrimaryOptionsOff
                life={opponentLife}
                timeLeft={timeLeft}
                type={
                  battleData?.acceptances?.idUser1 === userId
                    ? battleResultTypeUser1 + '' + battleResultTypeUser1
                    : battleResultTypeUser2 + '' + battleResultTypeUser2
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BattleComponent;
