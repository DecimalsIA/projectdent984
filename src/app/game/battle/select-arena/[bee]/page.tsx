'use client';

import TransactionComponent from '@/components/TransactionComponent';
import { useTelegram } from '@/context/TelegramContext';
import useSocket from '@/hooks/useSocket';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ButtonPambii,
  CardPambii,
  IconPambii,
  SlidePambii,
} from 'pambii-devtrader-front';
import { useState } from 'react';

const slideData = [
  {
    image: '/assets/bee-characters/arena/easy.png',
    title: 'Rookie Camp',
    type: 'easy',
    powers: [
      {
        power: 'Easy',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/easy.svg"
            alt="fire"
            width={18}
            height={18}
          />
        ),
      },
    ],
    habilites: [],
    abilitiesData: [],
  },

  {
    image: '/assets/bee-characters/arena/middle.png',
    title: 'Boxing in the desert',
    type: 'middle',
    powers: [
      {
        power: 'Middle',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/middle.svg"
            alt="fire"
            width={18}
            height={18}
          />
        ),
      },
    ],
    habilites: [],
    abilitiesData: [],
  },
  {
    image: '/assets/bee-characters/arena/hard.png',
    title: 'Coliseum of champions',
    type: 'hard',
    powers: [
      {
        power: 'Hard',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/hard.svg"
            alt="fire"
            width={18}
            height={18}
          />
        ),
      },
    ],
    habilites: [],
    abilitiesData: [],
  },
  // Añade más objetos según sea necesario
];

const SelectArenaPage: React.FC = () => {
  const { user } = useTelegram();
  const userId = user?.id.toString() ?? '792924145';
  const [cardType, setCardType] = useState<string>(slideData[0].type ?? '');
  const [abilitiesData, setAbilitiesData] = useState<any>(
    slideData[0].abilitiesData ?? [],
  );
  const { bee } = useParams();
  const { eventReceived, data } = useSocket('find-match');
  console.log('data', data, eventReceived);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const router = useRouter();
  const handleSelectArena = () => {
    alert(cardType);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide > 0 ? prevSlide - 1 : slideData.length - 1;
      setCardType(slideData[newSlide].type);
      setAbilitiesData(slideData[newSlide].abilitiesData ?? []);

      return newSlide;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide < slideData.length - 1 ? prevSlide + 1 : 0;
      setCardType(slideData[newSlide].type);
      setAbilitiesData(slideData[newSlide].abilitiesData ?? []);

      return newSlide;
    });
  };
  const handleBatle = () => {
    // alert(cardType);
    router.push('/game/battle/select-arena/' + bee + '/vs');
  };
  console.log('cardType', cardType);
  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <CardPambii
        type={cardType}
        className="bg-gray-200 w-full text-black card-pambii-b flex items-center justify-center"
      >
        <div>
          <div className="w-full flex flex-row justify-center flex-wrap gap-1">
            <SlidePambii
              slides={slideData}
              className="w-full"
              onPrevSlide={handlePrevSlide}
              onNextSlide={handleNextSlide}
            />
          </div>
          <ButtonPambii
            color="white"
            bg="#4e4e4e"
            className="mb-2"
            onClick={handleSelectArena}
            icon={<IconPambii />}
          >
            {cardType == 'middle' ? 100 : cardType == 'hard' ? 200 : 50} PAMBII
          </ButtonPambii>
          <div className="badgetext">
            The cost of PAMBII will depend on the difficulty, each game consumes
            a small part of the percentage.
          </div>
          <TransactionComponent
            textButton="Fight now"
            spl={cardType == 'middle' ? 100 : cardType == 'hard' ? 200 : 50}
            userid={userId}
            fromTrn="buy_battle"
            bee={bee}
            iconName="dollar.svg"
            idBuy={cardType}
            onClicker={() => handleBatle()}
          />{' '}
        </div>
      </CardPambii>
    </div>
  );
};

export default SelectArenaPage;
