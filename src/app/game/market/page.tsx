'use client';

import BeePartsCarousel from '@/components/BeePartsCarousel';
import ModalPambii from '@/components/ModalPambii';
import { useRouter } from 'next/navigation';
import {
  FireAnimated,
  HeartIcon,
  IconPambii,
  MoneyIcon,
  RankingIcon,
  StatsIcon,
  TabsPambii,
} from 'pambii-devtrader-front';
import { useState } from 'react';

const PublicMarketPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const beePartsData = {
    title: 'Fire bee parts',
    link: 'https://example.com/fire-bee-parts',
    category: 'fire',
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
  const modalData = {
    title: 'Front legs',
    image: '/assets/bee-characters/icons/beeImage.png', // Reemplaza con la ruta real de la imagen

    badges: [
      { icon: <HeartIcon />, value: 27 },
      { icon: <HeartIcon />, value: 13 },
      { icon: <HeartIcon />, value: 13 },
      { icon: <HeartIcon />, value: 13 },
      { icon: <HeartIcon />, value: 13 },
      { icon: <HeartIcon />, value: 13 },
      { icon: <HeartIcon />, value: 13 },
      // Añade más badges según sea necesario
    ],
    powerTitle: 'Front legs',
    description:
      'Throw 3 fireballs (x0.8) and burn the opponent for 2 turns (x0.8 each turn)',
    buttons: [
      {
        text: 'EQUIP',
        bg: '#7F29EE',
        color: 'white',
        w: 'full',
        icon: <FireAnimated />,
        onClick: () => alert('Equipped'),
      },
      {
        text: 'SELL ITEM',
        bg: '#EE9F29',
        color: 'white',
        w: 'full',
        icon: <MoneyIcon width="1.25rem" height="1.25rem" />,
        onClick: () => alert('Item Sold'),
      },
    ],
    bonus: [{ icon: <IconPambii />, value: 900, textBadge: ' PAMBII' }],
    onClose: () => setIsModalOpen(false),
  };
  const handleModal = (part: any, index: any) => {
    console.log('Modal', part, index);
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && <ModalPambii data={modalData} />}
      <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
        <div className="w-full">
          <BeePartsCarousel
            category={beePartsData}
            onCategoryClick={() =>
              router.push('/game/market/category/' + beePartsData.category)
            }
            onPartClick={(part, index) => {
              () => handleModal(part, index);
            }}
          />
          <BeePartsCarousel
            category={beePartsData}
            onCategoryClick={() =>
              router.push('/game/market/category/' + beePartsData.category)
            }
            onPartClick={(part, index) => {
              () => handleModal(part, index);
            }}
          />
          <BeePartsCarousel
            category={beePartsData}
            onCategoryClick={() =>
              router.push('/game/market/category/' + beePartsData.category)
            }
            onPartClick={(part, index) => handleModal(part, index)}
          />
        </div>
      </div>
    </>
  );
};

export default PublicMarketPage;
