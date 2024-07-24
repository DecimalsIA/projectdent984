'use client';

import { useRouter } from 'next/navigation';
import {
  BeeIcon,
  RankingIcon,
  StatsIcon,
  TablePambii,
  TabsPambii,
} from 'pambii-devtrader-front';

const StatsPage: React.FC = () => {
  const handleClick = (name: string) => {
    alert(`Clicked on ${name}`);
  };
  const beeData = [
    {
      name: 'ABEJITACHULA',
      level: 9,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('ABEJITACHULA'),
    },
    {
      name: 'BEE NAME',
      level: 7,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
  ];
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
      <TablePambii className="w-full" data={beeData} />
    </div>
  );
};

export default StatsPage;
