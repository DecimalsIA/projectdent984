'use client';

import BeePartsComponent from '@/components/BeeParts';
import { useRouter } from 'next/navigation';
import { RankingIcon, StatsIcon, TabsPambii } from 'pambii-devtrader-front';

const SpecialMarketPage: React.FC = () => {
  const partsData = [
    {
      image: '/assets/bee-characters/icons/beeImage.png',
      icon: '/assets/bee-characters/icons/fire.gif',
      name: 'Front legs',
    },
    {
      image: '/assets/bee-characters/icons/beeImage.png',
      icon: '/assets/bee-characters/icons/ghost.gif',
      name: 'Back legs',
    },
    {
      image: '/assets/bee-characters/icons/beeImage.png',
      icon: '/assets/bee-characters/icons/fire.gif',
      name: 'Head',
    },
    {
      image: '/assets/bee-characters/icons/beeImage.png',
      icon: '/assets/bee-characters/icons/ghost.gif',
      name: 'Back legs',
    },
    {
      image: '/assets/bee-characters/icons/beeImage.png',
      icon: '/assets/bee-characters/icons/fire.gif',
      name: 'Back legs',
    },
    {
      image: '/assets/bee-characters/icons/beeImage.png',
      icon: '/assets/bee-characters/icons/ghost.gif',
      name: 'Back legs',
    },
    // Más datos aquí...
  ];

  const router = useRouter();
  return (
    <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
      <div className="w-full">
        <BeePartsComponent partsData={partsData} title={true} />
      </div>
    </div>
  );
};

export default SpecialMarketPage;
