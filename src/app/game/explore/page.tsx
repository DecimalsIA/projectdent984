'use client';

import ExplorationInfo from '@/components/Exploration';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ButtonPambii, CardPambii, SlidePambii } from 'pambii-devtrader-front';
import { useState } from 'react';

const slideData = [
  {
    image: '/assets/bee-characters/arena/explore.png',
    title: 'EXPLORATION',
    type: 'hard',
    subtittle: '2 Pooled PAMBII',
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
  {
    image: '/assets/bee-characters/arena/explore.png',
    title: 'EXPLORATION',
    type: 'hard',
    subtittle: '1 Pooled PAMBII',
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
  {
    image: '/assets/bee-characters/arena/explore.png',
    title: 'EXPLORATION',
    type: 'hard',
    subtittle: '3 Pooled PAMBII',
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

const badgesData = [
  [
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/dollar.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Explorationw fee:',
      value: '20 PAMBII',
    },
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/archive.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Maximum wine amount:',
      value: '35 PAMBII',
    },
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/crown.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Maximum win rate:',
      value: '70%',
    },
  ],
  [
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/dollar.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Exploration fee:',
      value: '20 PAMBII',
    },
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/archive.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Maximum win amount:',
      value: '35 PAMBII',
    },
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/crown.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Maximum win rate:',
      value: '70%',
    },
  ],
  [
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/dollar.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Exploration fee:',
      value: '20 PAMBII',
    },
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/archive.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Maximum win amount:',
      value: '35 PAMBII',
    },
    {
      Icon: (
        <Image
          src="/assets/bee-characters/icons/crown.svg"
          alt="fire"
          width={18}
          height={18}
        />
      ),
      text: 'Maximum win rate:',
      value: '70%',
    },
  ],
];

const ExplorePage: React.FC = () => {
  const [cardType, setCardType] = useState<string>(slideData[0].type ?? '');
  const [abilitiesData, setAbilitiesData] = useState<any>(
    slideData[0].abilitiesData ?? [],
  );

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const router = useRouter();
  const handleSelectArena = () => {
    router.push('/game/explore/bee');
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

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <CardPambii
        type={cardType}
        className="bg-gray-200 w-full card-pambii-b  text-black flex items-center justify-center"
      >
        <div className="w-full flex flex-row justify-center flex-wrap gap-1">
          <SlidePambii
            slides={slideData}
            className="w-full max-w-md mx-auto"
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>
        <ExplorationInfo badges={badgesData[currentSlide]} />

        <ButtonPambii
          color="white"
          className="mb-2"
          onClick={handleSelectArena}
          icon={
            <Image
              src="/assets/bee-characters/icons/IconMap.svg"
              alt="Select arena"
              width={24}
              height={24}
            />
          }
        >
          Explore
        </ButtonPambii>
      </CardPambii>
    </div>
  );
};

export default ExplorePage;
