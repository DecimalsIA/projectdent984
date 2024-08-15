'use client';

import BeePartsCarousel from '@/components/BeePartsCarousel';
import ModalPambii from '@/components/ModalPambii';
import { useTelegram } from '@/context/TelegramContext';
import useGetPartsByType from '@/hooks/useGetPartsByType';
import { useRouter } from 'next/navigation';
import { FireAnimated, MoneyIcon } from 'pambii-devtrader-front';
import { useState } from 'react';

const InventoryPage: React.FC = () => {
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setIsDataModal] = useState();
  const router = useRouter();

  // Obtener las partes agrupadas por `typePart`
  const { categories, loading, error } = useGetPartsByType(userid);

  const handleModal = (part: any, index: any) => {
    console.log('Modal', part, index);
    const modalData: any = {
      title: part?.name + '-' + part.title,
      image: part?.image, // Usar el tipo para la imagen
      badges: [],
      buttons: [
        {
          text: 'EQUIP',
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
            <img src={part.icon} alt={part.name} width="24px" height="24px" />
          ),
          value: null,
          textBadge: part.title,
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
                onPartClick={(category, index) => handleModal(category, index)}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
