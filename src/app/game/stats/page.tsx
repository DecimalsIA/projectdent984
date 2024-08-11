'use client';

import { useTelegram } from '@/context/TelegramContext';
import useGetBee from '@/hooks/useGetBee';
import useGetExplorer from '@/hooks/usGetExplorer';
import { useRouter } from 'next/navigation';
import {
  BeeIcon,
  RankingIcon,
  StatsIcon,
  TablePambii,
  TabsPambii,
} from 'pambii-devtrader-front';

const StatsPage: React.FC = () => {
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';
  const { bees, loading } = useGetBee(userid);
  const { totalPayout, experience } = useGetExplorer(userid);
  const beeData: any = bees.map((bee, index) => ({
    image: '/assets/bee-characters/' + bee.image + '.png',
    name: bee.title ? bee.title.toUpperCase() : 'UNKNOWN',
    abilitiesData: bee.abilitiesData,
    power: bee.powers && bee.powers.length > 0 ? bee.powers : null,
    progress: bee.progress,
    index: index,
    id: bee.id,
    level: 1,
    icon: <BeeIcon className="text-orange-500" />,
  }));

  const tabs = [
    {
      title: 'Ranking',
      icon: <RankingIcon />,
      onClick: () => router.push('/game/ranking'),
    },
    {
      title: 'Stats',
      icon: <StatsIcon />,
      onClick: () => router.push('/game/stats'),
      state: 'active',
    },
  ];

  const router = useRouter();
  return (
    <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
      <div className="w-full">
        <TabsPambii
          tabs={tabs}
          mode="background"
          bg="#2a2a2a"
          className="mt-4 mb-3"
        />
      </div>
      {beeData && <TablePambii className="w-full" data={beeData} />}
    </div>
  );
};

export default StatsPage;
