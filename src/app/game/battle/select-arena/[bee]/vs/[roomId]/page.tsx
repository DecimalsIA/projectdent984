'use client';

import { useEffect, useState } from 'react';
import BattleComponent from '@/components/BattleComponent';
import { useTelegram } from '@/context/TelegramContext';
import { useParams } from 'next/navigation';
import useGetBattleByRoomId from '@/hooks/useGetBattleByRoomId';
import SelectBeeContainer from '@/components/SelectBeeContainer';
const WS =
  process.env.NEXT_PUBLIC_WS_URL || 'https://ws-server-pambii.onrender.com';
const SelectArenaPage: React.FC = () => {
  const { user } = useTelegram();
  const { roomId } = useParams();
  const userId = user?.id.toString() ?? '792924145';

  const { subscribeToBattleByRoomId, battle, loading } = useGetBattleByRoomId();
  const idsals: any = roomId;

  // Estado para el turno inicial, los datos de la batalla y la conexión de Socket.IO

  const [battleData, setBattleData] = useState<any>(null);

  useEffect(() => {
    // Cuando el componente se monta o cuando roomId cambia, obtenemos la batalla
    console.log('data', userId, idsals, battleData);
    if (idsals) {
      subscribeToBattleByRoomId(idsals);
      setBattleData(battle);
    }
  }, [subscribeToBattleByRoomId, battle, idsals]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center p-4">
        <SelectBeeContainer />{' '}
      </div>
    );
  }

  if (!battle) {
    return <div>No se encontró la batalla para el roomId: {roomId}</div>;
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4"
      style={{ backgroundImage: 'url(/bg-home.png)' }}
    >
      <BattleComponent userId={userId} battleData={battleData} />
    </div>
  );
};

export default SelectArenaPage;
