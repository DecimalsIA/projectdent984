'use client';

import ExplorationInfo from '@/components/Exploration';
import ExplorationCardGame from '@/components/ExplorationCardGame';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ButtonPambii, CardPambii, SlidePambii } from 'pambii-devtrader-front';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
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

const badgesData = [
  {
    Icon: (
      <Image
        src="/assets/bee-characters/icons/dollar.svg"
        alt="fire"
        width={18}
        height={18}
      />
    ),
    text: 'Total wins:',
    value: '129',
  },
  {
    Icon: (
      <Image
        src="/assets/bee-characters/icons/location.svg"
        alt="fire"
        width={18}
        height={18}
      />
    ),
    text: 'Total explorations:',
    value: '67',
  },
  {
    Icon: (
      <Image
        src="/assets/bee-characters/icons/startt.svg"
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

const ExplorePage: React.FC = () => {
  const [cardType, setCardType] = useState<string>(slideData[0].type ?? '');
  const [abilitiesData, setAbilitiesData] = useState<any>(
    slideData[0].abilitiesData ?? [],
  );
  const [explore, setExplorer] = useState<boolean>(true);
  const [slideType, setSlideType] = useState<string>('');
  const [dificultad, setdificultad] = useState<any>('');
  const [exploration, setExploration] = useState<any>(null);

  const { bee } = useParams();

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const router = useRouter();
  const notify = () => {
    toast.success('Hello, this is a success notification!');
  };
  const handleSelectArena = async (slide: any) => {
    console.log('slide', slide, bee);
    setSlideType(slide.type);
    setdificultad(bee);
    setExplorer(false);
    try {
      const data = await validExplorer(bee);
      console.log(data);
      setExploration(data);
      notify();
    } catch (error) {
      console.error('Error fetching explorer data:', error);
    }

    //router.push('/game/explore/bee/run');
  };

  const validExplorer = async (bee: any) => {
    let data = JSON.stringify({
      userId: 'pZzrHeGsqrGOhwI4CpYh',
      mapNumber: bee === 'easy' ? 1 : bee === 'middle' ? 2 : 3,
      valuePambii: bee === 'easy' ? 10 : bee === 'middle' ? 20 : 35,
      signature: '',
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/api/gexplore',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error; // Optional: re-throw the error if you want to handle it later
    }
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
    <>
      {explore ? (
        <>
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
              {badgesData && <ExplorationInfo badges={badgesData} />}

              <ButtonPambii
                color="white"
                className="mb-2"
                onClick={() => handleSelectArena(slideData[currentSlide])}
                icon={
                  <Image
                    src="/assets/bee-characters/icons/explore-icon.svg"
                    alt="Select arena"
                    width={24}
                    height={24}
                  />
                }
              >
                Select bee to explore
              </ButtonPambii>
            </CardPambii>
          </div>
        </>
      ) : (
        <>
          {' '}
          <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
            <CardPambii
              type={dificultad}
              className="bg-gray-200 w-full card-pambii-b  text-black flex items-center justify-center"
            >
              <div className="w-full flex flex-row justify-center flex-wrap gap-1">
                <ExplorationCardGame
                  bee={slideType}
                  dificultad={dificultad}
                  payout={exploration?.payout}
                  multiplier={exploration?.multiplier}
                />
              </div>
            </CardPambii>
          </div>
        </>
      )}
    </>
  );
};

export default ExplorePage;
