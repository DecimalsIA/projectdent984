'use client';

import { useEffect, useState } from 'react';
import BattleComponent from '@/components/BattleComponent';
import { useTelegram } from '@/context/TelegramContext';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import useGetBattleByRoomId from '@/hooks/useGetBattleByRoomId';
const WS =
  process.env.NEXT_PUBLIC_WS_URL || 'https://ws-server-pambii.onrender.com';
const SelectArenaPage: React.FC = () => {
  const { user } = useTelegram();
  const userId = user?.id.toString() ?? '792924145';
  const { roomId } = useParams();
  const { getBattleByRoomId, battle, loading } = useGetBattleByRoomId();
  const idsals: any = roomId;

  // Estado para el turno inicial, los datos de la batalla y la conexión de Socket.IO
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [battleData, setBattleData] = useState<any>(null);
  const [socketConnected, setSocketConnected] = useState(false); // Nuevo estado para la conexión

  useEffect(() => {
    const socket: Socket = io(WS); // Cambia la URL según tu configuración

    // Manejar eventos de conexión y desconexión
    socket.on('connect', () => {
      console.log('Conectado a Socket.IO');
      setSocketConnected(true); // Actualizar estado cuando el socket está conectado
    });

    socket.on('disconnect', () => {
      console.log('Desconectado de Socket.IO');
      setSocketConnected(false); // Actualizar estado cuando el socket está desconectado
    });

    // También puedes escuchar por errores de conexión
    socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });

    // Escuchar cuando la batalla comienza
    socket.on('start-battle', (data) => {
      console.log('Batalla iniciada:', data);
      setBattleData(data);
      setIsMyTurn(data.turn === userId);
    });

    // Escuchar actualizaciones de acción de batalla
    socket.on('action-update', (actionData) => {
      console.log('Acción de batalla recibida:', actionData);
    });

    // Escuchar cambios de turno
    socket.on('turn-change', (turnData) => {
      console.log('Cambio de turno:', turnData);
      setIsMyTurn(turnData.turn === userId);
    });

    // Escuchar cuando la batalla termina
    socket.on('battle-ended', (result) => {
      console.log('La batalla ha terminado:', result);
    });

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  console.log('data', userId, idsals, battleData);
  useEffect(() => {
    // Cuando el componente se monta o cuando roomId cambia, obtenemos la batalla
    if (idsals) {
      getBattleByRoomId(idsals);
      setBattleData(battle);
    }
  }, [roomId, getBattleByRoomId]);

  if (loading) {
    return <div>Cargando la batalla...</div>;
  }

  if (!battle) {
    return <div>No se encontró la batalla para el roomId: {roomId}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <BattleComponent isMyTurnInitially={isMyTurn} battleData={battleData} />
    </div>
  );
};

export default SelectArenaPage;
