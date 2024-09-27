'use client';

import BattleComponent from '@/components/BattleComponent';
import { useTelegram } from '@/context/TelegramContext';
import useSocket from '@/hooks/useSocket';
import { useParams } from 'next/navigation';

const SelectArenaPage: React.FC = () => {
  const { user } = useTelegram();
  const userId = user?.id.toString() ?? '792924145';

  const { roomId } = useParams();
  const { eventReceived, data } = useSocket('start-battle');
  console.log('data', data, eventReceived, userId, roomId);

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <BattleComponent isMyTurnInitially={false} battleData={undefined} />
    </div>
  );
};

export default SelectArenaPage;
