'use client';

import EditBee from '@/components/EditBee';
import ModalPambii from '@/components/ModalPambii';
import { useTelegram } from '@/context/TelegramContext';
import useFetchBees from '@/hooks/useFetchBees';
import { useParams, useRouter } from 'next/navigation';
import { PencilIcon } from 'pambii-devtrader-front';
import { ChangeEvent, useRef, useState } from 'react';

const SpecialMarketPage: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setDataModal] = useState();
  const [inputValue, setInputValue] = useState<string>('');
  const { user } = useTelegram();
  const { idbee } = useParams();
  const userid = user?.id.toString() ?? '792924145';
  const idBee: any = idbee;
  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks de datos
  const { data, loading, error: errorBee } = useFetchBees(userid, idBee);

  console.log('Edit', data);

  const handleViewInfo = (part: any) => {
    console.log('View info clicked for:', part.name);
    // Lógica para ver la información de la parte
  };

  const handleChangePart = (part: any) => {
    alert('You have no parts to change');
  };
  const handleChangeName = (name: string) => {
    const modalData: any = {
      title: 'Change name of bee : ' + name,
      body: (
        <input
          type="text"
          id="textInput"
          value={inputValue}
          onChange={handleChange}
          className="w-full inpurModal"
          ref={inputRef}
          placeholder={name}
        />
      ),
      buttons: [
        {
          text: 'Change name of bee',
          bg: '#4068f5',
          color: 'white',
          w: 'full',
          icon: <PencilIcon />,
          onClick: handleChangeName,
        },
      ],
      onClose: () => setIsModalOpen(false),
    };
    setDataModal(modalData);
    if (dataModal) {
      setIsModalOpen(true);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const transformBeeData = (beeFromRequest: {
    parts: any[];
    title: any;
    image: any;
  }) => {
    const beeParts = beeFromRequest.parts.map((part) => ({
      imageSrc: `/assets/bee-characters/category/${part.typePart.toLowerCase()}/${part.namePart.toLowerCase()}.png`, // Ruta a la imagen de la parte
      name: part.namePart.toUpperCase(),
      description: part.ability ? part.ability.description : '',
      badgeIconSrc: `/assets/bee-characters/category/${part.typePart.toLowerCase()}.gif`, // Icono según el tipo de parte
      badgeText: part.typePart,
    }));

    // Sumar todas las estadísticas de la abeja
    const beeStats = beeFromRequest.parts
      .flatMap((part) => part.stats)
      .map((stat) => ({
        iconSrc: `/assets/bee-characters/category/${stat.name.toLowerCase()}/${stat.name.toLowerCase()}.svg`, // Icono según el tipo de estadística
        value: stat.value,
      }));

    return {
      name: beeFromRequest.title,
      imageSrc: beeFromRequest.image, // Imagen principal de la abeja
      parts: beeParts,
      stats: [],
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorBee) {
    return <div>Error: {errorBee}</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full">
      <div className="w-full">
        {isModalOpen && dataModal && (
          <ModalPambii className="p-4" data={dataModal} />
        )}
        {data?.map((bee: any) => {
          const beeData = transformBeeData(bee);
          return (
            <EditBee
              key={bee.id}
              beeData={beeData}
              onViewInfo={handleViewInfo}
              onChangePart={handleChangePart}
              onChangeName={handleChangeName}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SpecialMarketPage;
