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
  const { part } = useParams();
  console.log('category', part);
  // Obtener las partes agrupadas por `typePart`
  const cat: any = part;
  const { categories, loading, error } = useGetPartsByTypePart(userid, '', cat);
  console.log('categories', categories);

  const handleModal = (part: any) => {
    console.log('handleModal', part);

    const buttons = [
      {
        text: 'BUY PARTS',
        bg: '#7F29EE',
        color: 'white',
        w: 'full',
        icon: <FireAnimated />,
        onClick: () => router.push('/game/market/public'),
      },
      {
        text: 'CHANGE',
        bg: '#EE9F29',
        color: 'white',
        w: 'full',
        icon: <MoneyIcon width="1.25rem" height="1.25rem" />,
        onClick: () => changeItem(part.isAssigned),
      },
    ];
    const modalData: any = {
      title: part.isAssigned
        ? part?.namePart + ' - Assigned'
        : part?.namePart + ' - Not assigned',
      image: part?.image, // Usar el tipo para la imagen
      badges: [],
      buttons: buttons,
      bonus: [
        {
          icon: (
            <img
              src={
                '/assets/bee-characters/category/' +
                part?.typePart.toLowerCase() +
                '.gif'
              }
              alt={part?.namePart}
              width="24px"
              height="24px"
            />
          ),
          value: null,
          textBadge: part?.typePart,
        },
      ],
      onClose: () => setIsModalOpen(false),
    };
    setIsDataModal(modalData);
    setIsModalOpen(true);
  };
  const changeItem = (isAssigned: boolean) => {
    if (isAssigned) {
      alert('Not available');
    }
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
                onPartClick={(category) => handleModal(category)}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
