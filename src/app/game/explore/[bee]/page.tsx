'use client';

import ExplorationInfo from '@/components/Exploration';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ButtonPambii, CardPambii, SlidePambii } from 'pambii-devtrader-front';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import TransactionComponent from '@/components/TransactionComponent';
import { useTelegram } from '@/context/TelegramContext';
import useVerifyPayment from '@/hooks/useVerifyPayment';
import ExplorationPlay from '@/components/ExplorationPlay';
import useGetBee from '@/hooks/useGetBee';
import useGetExplorer from '@/hooks/usGetExplorer';
/*const slideData = [
  {
    image: '/assets/bee-characters/fire.png',
    title: 'Abejitachula',
    type: 'fire',
    id: 1,
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
    id: 2,
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
]; */
type Power = {
  power: string;
  powerIcon: JSX.Element;
};

type Ability = {
  id: number;
  name: string;
  icon: JSX.Element;
};

type Progress = {
  // define the properties of progress, e.g.:
  percentage: number;
};

type BeeData = {
  image: string;
  title: string;
  abilitiesData: Ability[];
  power: Power[] | null;
  progress: Progress;
  type: string;
  id: string;
  index: number;
};

const ExplorePage: React.FC = () => {
  const { user } = useTelegram();
  const userId = user?.id?.toString() ?? '792924145';
  const router = useRouter();

  const { bees } = useGetBee(userId);
  const { totalRecords, totalPayout, experience, win, loss } =
    useGetExplorer(userId);
  const [slideData, setSlideData] = useState<BeeData[]>([]);
  const [cardType, setCardType] = useState<string>('');
  const [abilitiesData, setAbilitiesData] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [lockState, setLockState] = useState(false);

  const badgesData: any = [
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
      value: win,
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
      value: totalRecords,
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
      value: experience,
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
      value: totalPayout,
    },
  ];
  const { exists, data } = useVerifyPayment(userId);

  useEffect(() => {
    if (bees && bees.length > 0) {
      const mappedSlideData: any[] = bees.map((bee, index) => ({
        image: '/assets/bee-characters/' + bee.image + '.png',
        title: bee.title ? bee.title.toUpperCase() : 'UNKNOWN',
        abilitiesData: bee.abilitiesData,
        power: bee.powers && bee.powers.length > 0 ? bee.powers : null,
        progress: bee.progress,
        type: bee.type,
        id: bee.id,
        index: index,
      }));

      setSlideData(mappedSlideData);
      setCardType(mappedSlideData[0].type);
      setAbilitiesData(mappedSlideData[0].abilitiesData);
    }
  }, [bees]);

  const { bee } = useParams();

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
  useEffect(() => {
    if (exists && data) {
      const now = Date.now();
      const difference = data.timeLock - now;
      console.log('difference', difference, difference <= 0);
      setLockState(difference <= 0);
    }
  }, [exists, data]);

  console.log('lockState', lockState);

  if (!bees || slideData.length === 0) {
    return <div>Loading...</div>; // Muestra un indicador de carga mientras se inicializan los datos
  }

  return (
    <>
      <>
        <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
          <CardPambii
            type={cardType}
            className="bg-gray-200 w-full card-pambii-b  text-black flex items-center justify-center"
          >
            {slideData.length > 0 && (
              <div className="w-full flex flex-row justify-center flex-wrap gap-1">
                <SlidePambii
                  slides={slideData}
                  className="w-full max-w-md mx-auto"
                  onPrevSlide={handlePrevSlide}
                  onNextSlide={handleNextSlide}
                />
              </div>
            )}
            {badgesData && <ExplorationInfo badges={badgesData} />}
            {lockState && data.bee == slideData[currentSlide].id ? (
              <TransactionComponent
                spl={bee === 'easy' ? 10 : bee === 'middle' ? 20 : 35}
                userid={userId}
                fromTrn="explore"
                bee={slideData[currentSlide].id}
                map={bee}
              />
            ) : (
              <ButtonPambii
                color="white"
                className="mb-2"
                onClick={() =>
                  router.push('/game/explore/' + bee + '/' + data.bee)
                }
                icon={
                  <Image
                    src="/assets/bee-characters/icons/explore-icon.svg"
                    alt="Select arena"
                    width={24}
                    height={24}
                  />
                }
              >
                View Exploration
              </ButtonPambii>
            )}
          </CardPambii>
        </div>
      </>
    </>
  );
};

export default ExplorePage;
