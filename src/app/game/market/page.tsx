/* eslint-disable @next/next/no-img-element */
'use client';

import BeePartsCarousel from '@/components/BeePartsCarousel';
import ModalPambii from '@/components/ModalPambii';
import TransactionComponent from '@/components/TransactionComponent';
import { useTelegram } from '@/context/TelegramContext';
import useGetPartsMarketPlaceByType from '@/hooks/useGetPartsMarketPlaceByType';
import { useRouter } from 'next/navigation';
import { FireAnimated, MoneyIcon } from 'pambii-devtrader-front';
import { useState, useEffect } from 'react';

const InventoryPage: React.FC = () => {
  const userid = 'System';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setIsDataModal] = useState();
  const router = useRouter();
  const { user } = useTelegram();
  const userId = user?.id.toString() ?? '792924145';

  // Obtener las partes agrupadas por `typePart` y la función para cargar más
  const { categories, loading, error, loadMore, hasMore } =
    useGetPartsMarketPlaceByType(userid);

  console.log('useruseruseruseruser', user);

  const handleModal = (part: any, index: any) => {
    console.log('Modal', part, index);
    const modalData: any = {
      title: part?.name,
      image: part?.image, // Usar el tipo para la imagen
      description: part?.ability?.description,
      powerTitle: part?.ability?.name,
      badges: part.stats,
      powerBy: {
        name: user && user?.first_name + user?.last_name,
        id: userId,
        image: '/Pambii-bee.webp',
      },
      htmlButtom: (
        <TransactionComponent
          textButton="Buy Item"
          spl={30}
          userid={userId}
          fromTrn="buy_market_item"
          iconName="dollar.svg"
          idBuy={part.idPart}
        />
      ),

      bonus: [
        {
          icon: (
            <img src={part.icon} alt={part.name} width="24px" height="24px" />
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
  /*
buttons: [
        {
          text: 'BUY',
          bg: '#4caf50',
          color: 'white',
          w: 'full',
          icon: <MoneyIcon width="1.25rem" height="1.25rem" />,
          onClick: () => alert('Not available'),
        },
      ], */

  // Listener para el scroll para implementar carga perezosa
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      ) {
        return;
      }
      loadMore();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadMore]);

  return (
    <>
      {dataModal && isModalOpen && (
        <ModalPambii className="p-4" data={dataModal} />
      )}
      <div className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full">
        <div className="w-full mb-44">
          {loading && categories.length === 0 && <div>Loading...</div>}
          {error && <div>{error}</div>}
          {!loading &&
            categories.length > 0 &&
            categories.map((category, index) => (
              <BeePartsCarousel
                key={category.title + index}
                category={category}
                onCategoryClick={() =>
                  router.push('/game/market/category/' + category.title)
                }
                onPartClick={(category, index) => handleModal(category, index)}
              />
            ))}
          {loading && categories.length > 0 && <div>Loading more...</div>}
          {!loading && hasMore && (
            <button onClick={loadMore} className="mt-4">
              Load More
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
