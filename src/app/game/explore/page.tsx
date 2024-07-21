'use client';

import { useRouter } from 'next/navigation';
import { RankingIcon, StatsIcon, TabsPambii } from 'pambii-devtrader-front';

const ExplorePage: React.FC = () => {
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
    <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
      <div className="w-full">
        <TabsPambii
          tabs={tabs}
          mode="background"
          bg="#2a2a2a"
          className="mt-4 mb-8"
        />
      </div>
      Explore
    </div>
  );
};

export default ExplorePage;
