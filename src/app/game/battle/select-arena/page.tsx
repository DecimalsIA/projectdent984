'use client';

import { useRouter } from 'next/navigation';
import { RankingIcon, StatsIcon, TabsPambii } from 'pambii-devtrader-front';

const SelectArenaPage: React.FC = () => {
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
    },
  ];

  const router = useRouter();
  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <div className="mb-110">Battless arena</div>
    </div>
  );
};

export default SelectArenaPage;
