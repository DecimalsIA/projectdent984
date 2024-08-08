'use client';

import ExplorationInfo from '@/components/Exploration';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ButtonPambii, CardPambii, SlidePambii } from 'pambii-devtrader-front';
import { useState } from 'react';

const ExplorePage: React.FC = () => {
  const t = useTranslations('EXPLORE');
  const slideData = [
    {
      image: '/assets/bee-characters/arena/easy.png',
      title: t('EXPLORATION'),
      type: 'easy',
      subtittle: '2 Pooled PAMBII',
      powers: [
        {
          power: t('POWER_EASY'),
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
      title: t('EXPLORATION'),
      type: 'middle',
      subtittle: '1 Pooled PAMBII',
      powers: [
        {
          power: t('POWER_MIDDLE'),
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
      title: t('EXPLORATION'),
      type: 'hard',
      subtittle: '3 Pooled PAMBII',
      powers: [
        {
          power: t('POWER_HARD'),
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
        text: 'Exploration fee:',
        value: '10 PAMBII',
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
        value: '20 PAMBII',
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
        value: '60%',
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
        value: '50%',
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
        value: '35 PAMBII',
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
        value: '50 PAMBII',
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
        text: 'Win a Shiny part rate:',
        value: '5%',
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
        value: '40%',
      },
    ],
  ];
  const [cardType, setCardType] = useState<string>(slideData[0].type ?? '');
  const [abilitiesData, setAbilitiesData] = useState<any>(
    slideData[0].abilitiesData ?? [],
  );

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const router = useRouter();
  const handleSelectArena = (type: any) => {
    //router.push('/game/explore/' + type.type);
    router.push('/game/explore/buy');
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
          onClick={() => handleSelectArena(slideData[currentSlide])}
          icon={
            <Image
              src="/assets/bee-characters/icons/IconMap.svg"
              alt="Select arena"
              width={24}
              height={24}
            />
          }
        >
          {t('EXPLORE')}
        </ButtonPambii>
      </CardPambii>
    </div>
  );
};

export default ExplorePage;
