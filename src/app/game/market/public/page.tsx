'use client';

import BeePartsCarousel from '@/components/BeePartsCarousel';
import { useRouter } from 'next/navigation';
import { RankingIcon, StatsIcon, TabsPambii } from 'pambii-devtrader-front';

const PublicMarketPage: React.FC = () => {
  const router = useRouter();
  const parts = {
    title: 'Fire bee parts',
    link: 'https://example.com/fire-bee-parts',
    items: [
      {
        image: '/assets/bee-characters/icons/beeImage.png',
        icon: '/assets/bee-characters/icons/fire.gif',
        name: 'Back legs',
      },
      {
        image: '/assets/bee-characters/icons/beeImage.png',
        icon: '/assets/bee-characters/icons/fire.gif',
        name: 'Back legs',
      },
      {
        image: '/assets/bee-characters/icons/beeImage.png',
        icon: '/assets/bee-characters/icons/fire.gif',
        name: 'Back legs',
      },
      {
        image: '/assets/bee-characters/icons/beeImage.png',
        icon: '/assets/bee-characters/icons/fire.gif',
        name: 'Back legs',
      },
    ],
  };

  return (
    <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
      <div className="w-full">
        <BeePartsCarousel
          parts={parts.items}
          link={parts.link}
          title={parts.title}
        />
      </div>
    </div>
  );
};

export default PublicMarketPage;
