'use client';

import BeePartsCarousel from '@/components/BeePartsCarousel';
import ModalPambii from '@/components/ModalPambii';
import { useTelegram } from '@/context/TelegramContext';
import useGetPartsByTypePart from '@/hooks/useGetPartsByTypePart';
import { useRouter, useParams } from 'next/navigation';
import { FireAnimated, MoneyIcon } from 'pambii-devtrader-front';
import { useState } from 'react';

const InventoryPage: React.FC = () => {
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setIsDataModal] = useState();
  const router = useRouter();
  const { category } = useParams();
  console.log('category', category);
  // Obtener las partes agrupadas por `typePart`
  const cat: any = category;
  const { categories, loading, error } = useGetPartsByTypePart(userid, cat);

  const handleModal = (part: any, index: any) => {
    console.log('Modal', part, index);
    const modalData: any = {
      title: part?.namePart,
      image: '/assets/bee-characters/' + part.typePart.toLowerCase() + '.png', // Usar el tipo para la imagen
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
            <img
              src={
                '/assets/bee-characters/icons/' +
                part.typePart.toLowerCase() +
                '.gif'
              }
              alt={part.namePart}
              width="24px"
              height="24px"
            />
          ),
          value: null,
          textBadge: part.typePart,
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
          {loading && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {!loading &&
            categories.length > 0 &&
            categories.map((category) => (
              <BeePartsCarousel
                key={category.title}
                category={category}
                onCategoryClick={() =>
                  router.push('/game/inventory/category/' + category.title)
                }
                onPartClick={(part, index) => handleModal(part, index)}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
