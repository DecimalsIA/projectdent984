'use client';

import MatchmakingComponent from '@/components/MatchmakingComponent';
import TransactionComponent from '@/components/TransactionComponent';
import { useTelegram } from '@/context/TelegramContext';
import useSocket from '@/hooks/useSocket';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { CardPambii } from 'pambii-devtrader-front';
import { useState } from 'react';
const WS = process.env.NEXT_PUBLIC_WS_URL;
console.log('WS', WS);

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
  console.log('cardType', cardType);
  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4 mb-48">
      <CardPambii
        type={cardType}
        className="bg-gray-200 w-full text-black card-pambii-b flex items-center justify-center"
      >
        <MatchmakingComponent idUser={userId} arena={cardType} bee={bee} />
      </CardPambii>
    </div>
  );
};

export default SelectArenaPage;
