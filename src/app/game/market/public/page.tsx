'use client';

import BeePartsCarousel from '@/components/BeePartsCarousel';
import { useRouter } from 'next/navigation';
import { RankingIcon, StatsIcon, TabsPambii } from 'pambii-devtrader-front';

const PublicMarketPage: React.FC = () => {
  const router = useRouter();
  const beePartsData = {
    title: 'Fire bee parts',
    link: 'https://example.com/fire-bee-parts',
    parts: [
      {
        image: '/assets/bee-characters/icons/beeImage.png',
        icon: '/assets/bee-characters/icons/fire.gif',
        name: 'Back legs 1',
      },
      {
        image: '/assets/bee-characters/icons/beeImage.png',
        icon: '/assets/bee-characters/icons/fire.gif',
        name: 'Back legs 2',
      },
      {
        image: '/assets/bee-characters/icons/beeImage.png',
        icon: '/assets/bee-characters/icons/fire.gif',
        name: 'Back legs 3',
      },
      {
        image: '/assets/bee-characters/icons/beeImage.png',
        icon: '/assets/bee-characters/icons/fire.gif',
        name: 'Back legs 4',
      },
    ],
  };
  ///Users/user/Desktop/bee-characters/Bold/Arrows/arowr.svg

  return (
    <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
      <div className="w-full">
        <BeePartsCarousel
          category={beePartsData}
          onCategoryClick={() => console.log('Category clicked!')}
          onPartClick={(part, index) => console.log('Part clicked:', part)}
        />
        <BeePartsCarousel
          category={beePartsData}
          onCategoryClick={() => console.log('Category clicked!')}
          onPartClick={(part, index) => console.log('Part clicked:', part)}
        />
        <BeePartsCarousel
          category={beePartsData}
          onCategoryClick={() => console.log('Category clicked!')}
          onPartClick={(part, index) =>
            console.log('Part clicked:', part, index)
          }
        />
      </div>
    </div>
  );
};

export default PublicMarketPage;
