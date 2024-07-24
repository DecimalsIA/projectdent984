'use client';

import { useRouter } from 'next/navigation';
import {
  BeeIcon,
  RankingIcon,
  StatsIcon,
  TablePambii,
  TabsPambii,
} from 'pambii-devtrader-front';

const RankingPage: React.FC = () => {
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
    {
      name: 'BEE NAME',
      level: 6,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 5,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 5,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 3,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 2,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 1,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
  ];
  const tabs = [
    {
      title: 'Ranking',
      icon: <RankingIcon />,
      onClick: () => router.push('/game/ranking'),
      state: 'active',
    },
    {
      title: 'Stats',
      icon: <StatsIcon />,
      inactiveTabColor: 'active',
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
          className="mt-4 mb-3"
        />
      </div>
      <TablePambii className="w-full" data={beeData} />
    </div>
  );
};

export default RankingPage;
