'use client';

import ExplorationInfo from '@/components/Exploration';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ButtonPambii, CardPambii, SlidePambii } from 'pambii-devtrader-front';
import { useState } from 'react';

const slideData = [
  {
    image: '/assets/bee-characters/fire.png',
    title: 'Abejitachula',
    type: 'fire',
    powers: [
      {
        power: 'Fire',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/fire.png"
            alt="fire"
            width={18}
            height={18}
          />
        ),
      },
    ],
    habilites: [
      {
        id: 1,
        name: 'Ability 1',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 1"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 2,
        name: 'Ability 2',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 3,
        name: 'Ability 3',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 3"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 4,
        name: 'Ability 4',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 4"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 5,
        name: 'Ability 5',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 5"
            width={18}
            height={18}
          />
        ),
      },
    ],
  },

  {
    image: '/assets/bee-characters/rock.png',
    title: 'Carnero',
    type: 'rock',
    powers: [
      {
        power: 'Rock',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 1"
            width={18}
            height={18}
          />
        ),
      },
    ],
    habilites: [
      {
        id: 1,
        name: 'Ability 1',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 1"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 2,
        name: 'Ability 2',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 3,
        name: 'Ability 3',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 3"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 4,
        name: 'Ability 4',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 4"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 5,
        name: 'Ability 5',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 5"
            width={18}
            height={18}
          />
        ),
      },
    ],
  },
  {
    image: '/assets/bee-characters/poison.png',
    title: 'Coringa',
    type: 'poison',
    powers: [
      {
        power: 'Syringe',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/syringe.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
    ],
    habilites: [
      {
        id: 1,
        name: 'Ability 1',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 1"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 2,
        name: 'Ability 2',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 3,
        name: 'Ability 3',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 3"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 4,
        name: 'Ability 4',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 4"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 5,
        name: 'Ability 5',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 5"
            width={18}
            height={18}
          />
        ),
      },
    ],
  },
  {
    image: '/assets/bee-characters/all.png',
    title: 'Princesa monstruo',
    type: 'all',
    powers: [
      {
        power: 'Rock',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
      {
        power: 'Fire',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/fire.png"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
      {
        power: 'Ghost',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/ghost.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
      {
        power: 'Water',
        powerIcon: (
          <Image
            src="/assets/bee-characters/icons/bottle.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
    ],
    habilites: [
      {
        id: 1,
        name: 'Ability 1',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 1"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 2,
        name: 'Ability 2',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 3,
        name: 'Ability 3',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 3"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 4,
        name: 'Ability 4',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 4"
            width={18}
            height={18}
          />
        ),
      },
      {
        id: 5,
        name: 'Ability 5',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 5"
            width={18}
            height={18}
          />
        ),
      },
    ],
  },
  // Añade más objetos según sea necesario
];

const badgesData = [
  {
    Icon: (
      <Image
        src="/assets/bee-characters/icons/win.svg"
        alt="fire"
        width={18}
        height={18}
      />
    ),
    text: 'Total wins:',
    value: '9.850',
  },
  {
    Icon: (
      <Image
        src="/assets/bee-characters/icons/sperience.svg"
        alt="fire"
        width={18}
        height={18}
      />
    ),
    text: 'Total experience obtained:',
    value: '9.850',
  },
  {
    Icon: (
      <Image
        src="/assets/bee-characters/icons/dollar.svg"
        alt="fire"
        width={18}
        height={18}
      />
    ),
    text: 'Total PAMBII obtained:',
    value: '1.200',
  },
];

const StatsBeePage: React.FC = () => {
  const [cardType, setCardType] = useState<string>(slideData[0].type ?? '');

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const router = useRouter();
  const handleSelectArena = () => {
    alert(cardType);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide > 0 ? prevSlide - 1 : slideData.length - 1;
      setCardType(slideData[newSlide].type);
      return newSlide;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide < slideData.length - 1 ? prevSlide + 1 : 0;
      setCardType(slideData[newSlide].type);
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
            className="w-full"
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>

        <ExplorationInfo badges={badgesData} />

        <ButtonPambii
          color="white"
          className="mb-2"
          onClick={handleSelectArena}
          icon={
            <Image
              src="/assets/bee-characters/icons/edit.svg"
              alt="Select arena"
              width={24}
              height={24}
            />
          }
        >
          Edit bee
        </ButtonPambii>
      </CardPambii>
    </div>
  );
};

export default StatsBeePage;
