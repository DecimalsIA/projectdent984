'use client';

import BeePartsCarousel from '@/components/BeePartsCarousel';
import ModalPambii from '@/components/ModalPambii';
import { useTelegram } from '@/context/TelegramContext';
import useGetPartsByTypePart from '@/hooks/useGetPartsByTypePart';
import { useRouter, useParams } from 'next/navigation';
import { FireAnimated, MoneyIcon } from 'pambii-devtrader-front';
import { ChangeEvent, useRef, useState } from 'react';

const InventoryPage: React.FC = () => {
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setIsDataModal] = useState();
  const router = useRouter();
  const { category } = useParams();
  const [inputValue, setInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  console.log('category', category);
  // Obtener las partes agrupadas por `typePart`
  const cat: any = category;
  const { categories, loading, error } = useGetPartsByTypePart(userid, cat);

  const handleModal = (part: any, index: any) => {
    const modalData: any = {
      title: part?.name + '-' + part.title,
      image: part?.image, // Usar el tipo para la imagen
      description: part?.ability?.description,
      powerTitle: part?.ability?.name,
      badges: part.stats,
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
          onClick: () => handleModalSell(part),
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
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleModalSell = (part: any) => {
    setIsModalOpen(false);
    console.log('Modal', part);
    const modalData: any = {
      title: part?.name + '-' + part.title,
      image: part?.image, // Usar el tipo para la imagen
      badges: [],
      body: (
        <>
          <div className="beepartcategoryParent">
            <div className="beepartcategory">
              <b className="badgetext">Set your price for this bee part:</b>
            </div>
          </div>
          <div className="w-full mt-2 mb-2">
            <input
              type="text"
              id="textInput"
              value={inputValue}
              onChange={handleChange}
              className="w-full inpurModal"
              ref={inputRef}
              placeholder="300"
            />
          </div>
          <div className="abilitiescontainer">
            <div className="text">Sales information:</div>
            <div className="abilitiescontainer1">
              <div className="abilities">
                <div className="badgeMinibuttonTooltip">
                  <div className="achievementcontainer">
                    <img
                      className="boldMoneyDollar"
                      alt=""
                      src="/assets/bee-characters/icons/dollar.svg"
                    />
                    <div className="badgetext">Sale fee:</div>
                  </div>
                  <div className="badgetext1">10 PAMBII</div>
                </div>
                <div className="badgeMinibuttonTooltip">
                  <div className="achievementcontainer">
                    <img
                      className="boldNotesArchiveUpMini"
                      alt=""
                      src="/assets/bee-characters/icons/archive.svg"
                    />
                    <div className="badgetext">Min. price</div>
                  </div>
                  <div className="badgetext1">200 PAMBII</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
      buttons: [
        {
          text: 'SELL ITEM',
          bg: '#EE9F29',
          color: 'white',
          w: 'full',
          icon: <MoneyIcon width="1.25rem" height="1.25rem" />,
          onClick: () => handleModalSell(part),
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
                onPartClick={(part, index) => handleModal(part, index)}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
