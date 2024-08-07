'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AbilitiesPambii,
  ButtonPambii,
  CardPambii,
  HeartIcon,
  SlidePambii,
} from 'pambii-devtrader-front';
import { useState } from 'react';

const slideData = [
  {
    image: '/assets/bee-characters/fuego.png',
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
    habilites: [],
    abilitiesData: [
      {
        id: 1,
        name: 'Ability 1',
        icon: (
          <Image
            src="/assets/bee-characters/icons/fire.png"
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
            src="/assets/bee-characters/icons/fire.png"
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
            src="/assets/bee-characters/icons/fire.png"
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
            src="/assets/bee-characters/icons/fire.png"
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
            src="/assets/bee-characters/icons/fire.png"
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
    abilitiesData: [
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
    abilitiesData: [
      {
        id: 1,
        name: 'Ability 1',
        icon: (
          <Image
            src="/assets/bee-characters/icons/syringe.svg"
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
            src="/assets/bee-characters/icons/syringe.svg"
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
            src="/assets/bee-characters/icons/syringe.svg"
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
            src="/assets/bee-characters/icons/syringe.svg"
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
            src="/assets/bee-characters/icons/syringe.svg"
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
    habilities: [
      {
        name: 'Rock',
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
        name: 'Rock',
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
        name: 'Rock',
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
        name: 'Rock',
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
        name: 'Rock',
        icon: (
          <Image
            src="/assets/bee-characters/icons/sledgehammer.svg"
            alt="Ability 2"
            width={18}
            height={18}
          />
        ),
      },
    ],
    abilitiesData: [
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
            src="/assets/bee-characters/icons/fire.png"
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
            src="/assets/bee-characters/icons/fire.png"
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
            src="/assets/bee-characters/icons/ghost.svg"
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
            src="/assets/bee-characters/icons/bottle.svg"
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

const BattlePage: React.FC = () => {
  const [cardType, setCardType] = useState<string>(slideData[0].type ?? '');
  const [abilitiesData, setAbilitiesData] = useState<any>(
    slideData[0].abilitiesData ?? [],
  );
  const [habilities, setHabilities] = useState<any>(
    slideData[0].habilities ?? [],
  );
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const router = useRouter();
  const handleSelectArena = () => {
    alert(cardType);
    router.push('/game/battle/select-arena');
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide > 0 ? prevSlide - 1 : slideData.length - 1;
      setCardType(slideData[newSlide].type);
      setAbilitiesData(slideData[newSlide].abilitiesData ?? []);
      setHabilities(slideData[newSlide].habilities ?? []);
      return newSlide;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide < slideData.length - 1 ? prevSlide + 1 : 0;
      setCardType(slideData[newSlide].type);
      setAbilitiesData(slideData[newSlide].abilitiesData ?? []);
      setHabilities(slideData[newSlide].habilities ?? []);
      return newSlide;
    });
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <CardPambii
        type={cardType}
        className="bg-gray-200 w-full text-black card-pambii-b flex items-center justify-center"
      >
        <div className="w-full flex flex-row justify-center flex-wrap gap-1">
          <SlidePambii
            slides={slideData}
            className="w-full"
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>

        {abilitiesData && (
          <div className="w-full">
            <AbilitiesPambii abilities={abilitiesData} />
          </div>
        )}
        <ButtonPambii
          color="white"
          onClick={handleSelectArena}
          icon={
            <Image
              src="/assets/bee-characters/icons/nextBatteleorArena.svg"
              alt="Select arena"
              width={24}
              height={24}
            />
          }
        >
          Select arena
        </ButtonPambii>
      </CardPambii>
    </div>
  );
};

export default BattlePage;
