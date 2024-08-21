import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from './MatchmakingComponent.module.css';

interface MatchmakingProps {
  idUser: string;
  arena: string;
}

interface MatchData {
  idUser1: string;
  idUser2: string;
  arena: string;
  status: string;
}

export default function MatchmakingComponent({
  idUser,
  arena,
}: MatchmakingProps) {
  const [timeLeft, setTimeLeft] = useState(180000); // Inicializa el temporizador en 180,000 milisegundos (3 minutos)
  const [isMatching, setIsMatching] = useState(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null); // Guarda los datos de la coincidencia
  const [rejectionCount, setRejectionCount] = useState(0); // Contador de rechazos
  const socketRef = useRef<any>(null); // Referencia para el socket
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null); // Referencia para el intervalo de reintento

  useEffect(() => {
    // Conectar al servidor de Socket.IO al montar el componente
    socketRef.current = io('http://localhost:3000'); // Asegúrate de usar la URL correcta

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

  const handleSendRequest = async () => {
    try {
      const response = await fetch('/api/send-matchmaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idUser, arena }),
      });

      const data = await response.json();
      if (data.success) {
        setIsMatching(true);
        // Emitir el evento de find-match
        console.log('Emitiendo find-match:', { idUser, arena });
        socketRef.current.emit('find-match', { idUser, arena });
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleAccept = () => {
    console.log('///');
    if (matchData && socketRef.current) {
      socketRef.current.emit('accept-match', matchData);
    }
  };

  const handleReject = () => {
    setRejectionCount((prevCount) => prevCount + 1);
    if (rejectionCount >= 1 && socketRef.current) {
      setIsMatching(false);
      socketRef.current.emit('cancel-match');
    } else if (socketRef.current) {
      socketRef.current.emit('find-match', { idUser, arena });
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
      {isMatching ? (
        <div className={styles.timerCircle}>
          <span className={styles.timerText}>
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </div>
      ) : matchData ? (
        <div>
          <p>
            Match found with users: {matchData.idUser1} and {matchData.idUser2}
          </p>
          <button onClick={handleAccept}>Accept</button>
          <button onClick={handleReject}>Reject</button>
        </div>
      ) : (
        <button onClick={handleSendRequest}>Start Matchmaking</button>
      )}
    </div>
  );
}
