'use client';

import BeePartsCarousel from '@/components/BeePartsCarousel';
import ModalPambii from '@/components/ModalPambii';
import { useTelegram } from '@/context/TelegramContext';
import useGetBee from '@/hooks/useGetBee';
import { useRouter } from 'next/navigation';
import {
  FireAnimated,
  HeartIcon,
  IconPambii,
  MoneyIcon,
} from 'pambii-devtrader-front';
import { useState } from 'react';

const InventoryPage: React.FC = () => {
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setIsDataModal] = useState();
  const router = useRouter();
  const { bees, loading } = useGetBee(userid);
  console.log('bees', bees);

  const slideData = bees.map((bee, index) => ({
    image: '/assets/bee-characters/' + bee.image + '.png',
    name: bee.title ? bee.title.toUpperCase() : 'UNKNOWN',
    abilitiesData: bee.abilitiesData,
    power: bee.powers && bee.powers.length > 0 ? bee.powers : null,
    progress: bee.progress,
    index: index,
    icon: '/assets/bee-characters/icons/' + bee.type + '.gif',
    id: bee.id,
    category: bee.type,
  }));

  const beeData = {
    title: 'My BEE',
    link: '',
    category: 'fire',
    parts: slideData,
  };

  const beePartsData = {
    title: 'Fire bee parts',
    link: '',
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

  const handleModal = (part: any, index: any) => {
    console.log('Modal', part, index);
    const modalData: any = {
      title: part?.name,
      image: part?.image, // Reemplaza con la ruta real de la imagen
      badges: [],

      buttons: [
        {
          text: 'BUY PARTS',
          bg: '#7F29EE',
          color: 'white',
          w: 'full',
          icon: <FireAnimated />,
          onClick: () => router.push('/game/market/public'),
        },
        {
          text: 'SELL ITEM',
          bg: '#EE9F29',
          color: 'white',
          w: 'full',
          icon: <MoneyIcon width="1.25rem" height="1.25rem" />,
          onClick: () => alert('Not available'),
        },
      ],
      bonus: [
        {
          icon: (
            <img src={part?.icon} alt={part?.name} width="24px" height="24px" />
          ),
          value: null,
          textBadge: part.category,
        },
      ],
      onClose: () => setIsModalOpen(false),
    };
    setIsDataModal(modalData);
    setIsModalOpen(true);
  };

  return (
    <>
      {dataModal && isModalOpen && (
        <ModalPambii className="p-4" data={dataModal} />
      )}
      <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
        <div className="w-full">
          <BeePartsCarousel
            category={beeData}
            onCategoryClick={() => router.push('/game/inventory/bee')}
            onPartClick={(part, index) => handleModal(part, index)}
          />
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
