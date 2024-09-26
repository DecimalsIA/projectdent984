import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from './MatchmakingComponent.module.css';
import Image from 'next/image';
import { ButtonPambii } from 'pambii-devtrader-front';
import Bee from './Bee';
const WS = process.env.NEXT_PUBLIC_WS_URL;
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
  const [timeLeft, setTimeLeft] = useState(180000); // Inicializa el temporizador en 180,000 milisegundos (3 minutos)
  const [acceptTimeLeft, setAcceptTimeLeft] = useState<number | null>(0); // Tiempo restante para aceptar el match
  const [isMatching, setIsMatching] = useState(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null); // Guarda los datos de la coincidencia
  const [rejectionCount, setRejectionCount] = useState(0); // Contador de rechazos
  const socketRef = useRef<any>(null); // Referencia para el socket
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null); // Referencia para el intervalo de reintento

  useEffect(() => {
    // Conectar al servidor de Socket.IO al montar el componente
    socketRef.current = io(WS); // Asegúrate de usar la URL correcta

    // Verificar la conexión
    socketRef.current.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    socketRef.current.on('connect_error', (error: any) => {
      console.error('Error al conectar a Socket.IO:', error);
    });

    // Escuchar el evento 'match-found'
    socketRef.current.on('match-found', (matchData: MatchData) => {
      console.log('Match found:', matchData);
      setIsMatching(false);
      setMatchData(matchData); // Actualiza el estado con los datos del match
      if (retryIntervalRef.current) clearInterval(retryIntervalRef.current); // Detener el reintento

      // Iniciar el temporizador de 10 segundos para aceptar el match
      setAcceptTimeLeft(100);
      const acceptTimer = setInterval(() => {
        setAcceptTimeLeft((prev) => {
          if (prev !== null && prev > 0) return prev - 1;
          clearInterval(acceptTimer);
          return null;
        });
      }, 10000);
    });

    // Escuchar el evento 'waiting'
    socketRef.current.on('waiting', () => {
      console.log('Still waiting for a match...');
      // Reintentar después de un tiempo si no se encuentra una coincidencia
      if (!retryIntervalRef.current) {
        retryIntervalRef.current = setInterval(() => {
          console.log('Reintentando búsqueda de coincidencia...');
          socketRef.current.emit('find-match', { idUser, arena });
        }, 5000); // Reintentar cada 5 segundos
      }
    });

    // Desconectar el socket al desmontar el componente
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
  }, [idUser, arena]); // Ejecutar solo una vez cuando el componente se monta

  const dataUser1: any = matchData?.data?.bees[0]?.parts?.reduce(
    (acc: any, part: any) => {
      acc[part.namePart] = part;
      return acc;
    },
    {},
  );
  const dataUser2: any = matchData?.data?.bees[1]?.parts?.reduce(
    (acc: any, part: any) => {
      acc[part.namePart] = part;
      return acc;
    },
    {},
  );

  const handleSendRequest = async () => {
    try {
      const response = await fetch('/api/send-matchmaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idUser, arena, bee }),
      });

      const data = await response.json();
      if (data.success) {
        setIsMatching(true);
        // Emitir el evento de find-match
        console.log('Emitiendo find-match:', { idUser, arena, bee });
        socketRef.current.emit('find-match', { idUser, arena, bee });
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleAccept = () => {
    console.log(matchData);
    console.log(socketRef.current);
    if (matchData && socketRef.current) {
      socketRef.current.emit('accept-match', matchData);
      console.log(socketRef.current);
    }
  };

  const handleReject = () => {
    setRejectionCount((prevCount) => prevCount + 1);
    if (rejectionCount >= 1 && socketRef.current) {
      setIsMatching(false);
      socketRef.current.emit('cancel-match');
    } else if (socketRef.current) {
      socketRef.current.emit('find-match', { idUser, arena, bee });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMatching) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1000 : 0));
      }, 1000);
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
                src={'/assets/bee-characters/arena/' + arena + '.png'}
              />
            </div>
            <div className={styles.name}>Waiting the match</div>
            <div className={styles.nameWrapper}>
              <div className={styles.name}>
                {' '}
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
            <div className="flex">
              <div className="battle-bee">
                <Bee
                  basePathW={
                    dataUser1?.['wings']?.typePart?.toLowerCase() || ''
                  }
                  basePathH={dataUser1?.['head']?.typePart?.toLowerCase() || ''}
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

              <div className="battle-bee-thow">
                {' '}
                <Bee
                  basePathW={
                    dataUser2?.['wings']?.typePart?.toLowerCase() || ''
                  }
                  basePathH={dataUser2?.['head']?.typePart?.toLowerCase() || ''}
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
            <div className="tittle-bttle">VS</div>
          </div>
          <div className="center text-center tittle-bttle">MATCH FOUND</div>

          {acceptTimeLeft !== null && <></>}
          <div className={styles.timerCircle}>
            <span className={styles.timerText}>{acceptTimeLeft}</span>
          </div>
          <div className="flex gap-2">
            {' '}
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
              decline
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
