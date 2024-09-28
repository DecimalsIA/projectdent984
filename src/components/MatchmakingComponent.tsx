/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from './MatchmakingComponent.module.css';
import Image from 'next/image';
import { ButtonPambii } from 'pambii-devtrader-front';
import Bee from './Bee';
import useFetchBees from '@/hooks/useFetchBees';
import UserComponent from './UserComponent';
import BattleComponent from './BattleComponent';
import { useRouter } from 'next/navigation';
import useGetUserById from '@/hooks/useGetUsers';

const WS =
  process.env.NEXT_PUBLIC_WS_URL || 'https://ws-server-pambii.onrender.com';
console.log('WS', WS);

interface MatchmakingProps {
  idUser: string;
  arena: string;
  bee?: any;
}

interface MatchData {
  idUser1: string;
  idUser2: string;
  user1Bee: string;
  user2Bee: string;
  arena: string;
  status: string;
  data?: any;
}

export default function MatchmakingComponent({
  idUser,
  arena,
  bee,
}: MatchmakingProps) {
  const [timeLeft, setTimeLeft] = useState(180000); // Temporizador de 3 minutos
  const { data: dataBee, loading, error: errorBee } = useFetchBees(idUser, bee);
  const { getUserById } = useGetUserById();
  const router = useRouter();

  const [acceptTimeLeft, setAcceptTimeLeft] = useState<number | null>(0); // Tiempo restante para aceptar el match
  const [isMatching, setIsMatching] = useState(false);
  const [isBattle, setIsisBattle] = useState(true);
  const [matchData, setMatchData] = useState<any | null>(null); // Datos de la coincidencia
  const [rejectionCount, setRejectionCount] = useState(0); // Contador de rechazos
  const socketRef = useRef<any>(null); // Referencia para el socket
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null); // Referencia para el intervalo de reintento

  // Inicialización de socket y conexión
  useEffect(() => {
    if (!WS) {
      console.error('WebSocket URL is not defined');
      return;
    }

    // Conectar al servidor de Socket.IO
    socketRef.current = io(WS);

    // Verificar la conexión
    socketRef.current.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    socketRef.current.on('connect_error', (error: any) => {
      console.error('Error al conectar a Socket.IO:', error);
    });

    // Escuchar el evento 'match-found'
    socketRef.current.on('match-found', async (matchData: MatchData) => {
      console.log('Match found:', matchData);

      setIsMatching(false);
      setMatchData(matchData);
      if (retryIntervalRef.current) clearInterval(retryIntervalRef.current); // Detener reintento

      // Iniciar el temporizador de 10 segundos para aceptar el match
      setAcceptTimeLeft(100);
      const acceptTimer = setInterval(() => {
        setAcceptTimeLeft((prev) => {
          if (prev !== null && prev > 0) return prev - 1;
          clearInterval(acceptTimer);
          return null;
        });
      }, 1000); // Temporizador de 1 segundo por intervalo
    });

    // Escuchar el evento 'waiting'
    socketRef.current.on('waiting', () => {
      console.log('Esperando coincidencia...');
      // Reintentar después de un tiempo si no se encuentra coincidenciasss
      if (!retryIntervalRef.current) {
        retryIntervalRef.current = setInterval(() => {
          console.log('Reintentando búsqueda de coincidencia...');
          socketRef.current.emit('find-match', {
            idUser,
            arena,
            idbee: bee,
            bee: dataBee,
          });
        }, 5000); // Reintentar cada 5 segundos
      }
    });

    // Escuchar el evento 'start-battle' y mostrar la alerta
    socketRef.current.on('start-battle', (data: any) => {
      console.log('La batalla ha comenzado:', data);
      socketRef.current.emit('start-match', data);
      setIsisBattle(true);
      router.push('/game/battle/select-arena/' + bee + '/vs/' + data.roomId);
      alert('La batalla ha comenzado!');
    });

    // Limpiar cuando el componente se desmonte
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    };
  }, [idUser, arena, bee, dataBee]);

  // Procesamiento de los datos de las abejas de ambos jugadores
  const dataIdUser1 = matchData?.idUser1;
  const dataUser1: any = matchData?.bee1[0]?.parts?.reduce(
    (acc: any, part: any) => {
      acc[part.namePart] = part;
      return acc;
    },
    {},
  );
  const dataIdUser2 = matchData?.idUser2;
  const dataUser2: any = matchData?.bee2[0]?.parts?.reduce(
    (acc: any, part: any) => {
      acc[part.namePart] = part;
      return acc;
    },
    {},
  );

  // Solicitar matchmaking
  const handleSendRequest = async () => {
    try {
      const response = await fetch('/api/send-matchmaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idUser, arena, idbee: bee, bee: dataBee }),
      });

      const data = await response.json();
      if (data.success) {
        setIsMatching(true);
        // Emitir el evento de find-match
        console.log('Emitiendo find-match:', {
          idUser,
          arena,
          idbee: bee,
          bee: dataBee,
        });
        socketRef.current.emit('find-match', {
          idUser,
          arena,
          idbee: bee,
          bee: dataBee,
        });
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  // Aceptar el match
  const handleAccept = async () => {
    console.log('Match found:', matchData);
    if (matchData && socketRef.current) {
      const foundUser = await getUserById(idUser);
      let newMatchData = {};
      if (matchData.idUser1 == idUser) {
        newMatchData = {
          nameuser: foundUser?.nomTlram,
          player: '1',
          bee: matchData.bee1,
          idUser1: idUser,
          nameBee: matchData.bee1[0].title,
        };
      }
      if (matchData.idUser2 == idUser) {
        newMatchData = {
          nameuser: foundUser?.nomTlram,
          player: '2',
          bee: matchData.bee2,
          idUser2: idUser,
          nameBee: matchData.bee2[0].title,
        };
      }
      console.log(newMatchData);
      socketRef.current.emit('accept-match', newMatchData);
    } // start-battle
  };

  // Rechazar el match
  const handleReject = () => {
    setRejectionCount((prevCount) => prevCount + 1);
    if (rejectionCount >= 1 && socketRef.current) {
      setIsMatching(false);
      socketRef.current.emit('cancel-match');
    } else if (socketRef.current) {
      socketRef.current.emit('find-match', {
        idUser,
        arena,
        dataBee,
        idbee: bee,
      });
    }
  };

  // Temporizador para el matchmaking
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMatching) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1000 : 0));
      }, 1000); // Disminuir el tiempo cada 1 segundo
    }

    return () => {
      clearInterval(timer);
    };
  }, [isMatching]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className={styles.matchmakingContainer}>
      <div className={styles.name}>Coliseum of champions</div>
      {isMatching ? (
        <div className="w-full">
          <div className={styles.nameParent}>
            <div className={styles.image4Wrapper}>
              <img
                className={styles.image4Icon}
                alt=""
                src={`/assets/bee-characters/arena/${arena}.png`}
              />
            </div>
            <div className={styles.name}>Waiting for the match</div>
            <div className={styles.nameWrapper}>
              <div className={styles.name}>
                <span className={styles.timerText}>
                  {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
            </div>
            <div className={styles.button}>
              <div className={styles.box} />
              <div className={styles.box1}>
                <img
                  className={styles.icon}
                  alt=""
                  src="/assets/bee-characters/icons/decline.svg"
                />
                <div className={styles.label}>CANCEL BATTLE</div>
              </div>
            </div>
          </div>
        </div>
      ) : matchData ? (
        <div>
          <div className="center text-center">
            <div className="flex flex-row flex-nowrap w-full">
              <div>
                <div className="">
                  {' '}
                  <div className="name-battle">
                    <UserComponent userId2={dataIdUser1} />
                  </div>
                </div>
                <div className="battle-bee">
                  <Bee
                    basePathW={
                      dataUser1?.['wings']?.typePart?.toLowerCase() || ''
                    }
                    basePathH={
                      dataUser1?.['head']?.typePart?.toLowerCase() || ''
                    }
                    basePathF={
                      dataUser1?.['frontLegs']?.typePart?.toLowerCase() || ''
                    }
                    basePathHi={
                      dataUser1?.['hindLegs']?.typePart?.toLowerCase() || ''
                    }
                    basePathSt={
                      dataUser1?.['stinger']?.typePart?.toLowerCase() || ''
                    }
                    basePathT={
                      dataUser1?.['torso']?.typePart?.toLowerCase() || ''
                    }
                    classSes="bee-battle-be"
                  />
                </div>
              </div>
              <div>
                <div>
                  <div className="flex name-battle-thow">
                    <UserComponent userId2={dataIdUser2} />
                  </div>
                </div>
                <div className="battle-bee-thow">
                  <Bee
                    basePathW={
                      dataUser2?.['wings']?.typePart?.toLowerCase() || ''
                    }
                    basePathH={
                      dataUser2?.['head']?.typePart?.toLowerCase() || ''
                    }
                    basePathF={
                      dataUser2?.['frontLegs']?.typePart?.toLowerCase() || ''
                    }
                    basePathHi={
                      dataUser2?.['hindLegs']?.typePart?.toLowerCase() || ''
                    }
                    basePathSt={
                      dataUser2?.['stinger']?.typePart?.toLowerCase() || ''
                    }
                    basePathT={
                      dataUser2?.['torso']?.typePart?.toLowerCase() || ''
                    }
                    classSes="bee-battle-be"
                  />
                </div>
              </div>
            </div>
            <div className="tittle-bttle">VS</div>
            <div className="center text-center tittle-bttle">MATCH FOUND</div>
            <div className={styles.image4Wrapper}>
              <img
                className={styles.image4Icon}
                alt=""
                src={`/assets/bee-characters/arena/${arena}.png`}
              />
            </div>
          </div>
          <div className="center text-center tittle-bttle">ARENA : {arena}</div>

          {acceptTimeLeft !== null && (
            <div className={styles.timerCircle}>
              <span className={styles.timerText}>{acceptTimeLeft}</span>
            </div>
          )}
          <div className="flex gap-2 p-2">
            <ButtonPambii
              color="white"
              bg="#52be97"
              onClick={handleAccept}
              icon={
                <Image
                  src="/assets/bee-characters/icons/nextBatteleorArena.svg"
                  alt="Select arena"
                  width={24}
                  height={24}
                />
              }
            >
              Accept
            </ButtonPambii>
            <ButtonPambii
              color="white"
              bg="#df444d"
              onClick={handleReject}
              icon={
                <Image
                  src="/assets/bee-characters/icons/nextBatteleorArena.svg"
                  alt="Select arena"
                  width={24}
                  height={24}
                />
              }
            >
              Decline
            </ButtonPambii>
          </div>
        </div>
      ) : (
        <div className={styles.name}>
          <button onClick={handleSendRequest}>Start Matchmaking</button>
        </div>
      )}
    </div>
  );
}
