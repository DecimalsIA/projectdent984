'use client';

import ExplorationInfo from '@/components/Exploration';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ButtonPambii,
  CardPambii,
  RankingIcon,
  SlidePambii,
  StatsIcon,
  TabsPambii,
} from 'pambii-devtrader-front';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import TransactionComponent from '@/components/TransactionComponent';
import { useTelegram } from '@/context/TelegramContext';
import useVerifyPayment from '@/hooks/useVerifyPayment';
import ExplorationPlay from '@/components/ExplorationPlay';
import useGetBee from '@/hooks/useGetBee';
import useGetExplorer from '@/hooks/usGetExplorer';
import useFetchBees from '@/hooks/useFetchBees';

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
  const { data: beesData } = useFetchBees(userId);
  const { totalRecords, totalPayout, experience, win, loss } =
    useGetExplorer(userId);
  const [slideData, setSlideData] = useState<BeeData[]>([]);
  const [cardType, setCardType] = useState<string>('');
  const [abilitiesData, setAbilitiesData] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [lockState, setLockState] = useState(false);
  console.log('beesData', beesData);
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
    if (beesData && bees && bees.length > 0) {
      const mappedSlideData: any[] = beesData.map((bee, index) => ({
        image: bee.image,
        title: bee.title ? bee.title.toUpperCase() : 'UNKNOWN',
        abilitiesData: bee?.abilitiesData,
        power: bee.powers && bee.powers.length > 0 ? bee.powers : null,
        type: bee.type,
        id: bee.id,
        index: index,
      }));

      setSlideData(mappedSlideData);
      setCardType(mappedSlideData[0]?.type || '');
      setAbilitiesData(mappedSlideData[0]?.abilitiesData || []);
    }
  }, [bees, beesData]);

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
    console.log('exists000', exists);
    console.log('data---->', data);
    if (exists && data) {
      console.log('La transacción existe y los datos son:', data);
      // router.push('/game/explore/' + data?.map + '/' + data?.bee);

      const now = Date.now();
      const difference = data.timeLock - now;

      if (difference <= 0) {
        console.log('La transacción ha expirado.');

        // Aquí puedes realizar alguna acción adicional si la transacción ha expirado
      }
    } else {
      console.log('No se encontraron transacciones para el usuario.');
    }
  }, [data, exists, router]);
  /*
  useEffect(() => {
    console.log('exists000', exists);
    console.log('data---->', data);
    if (exists && data) {
      const now = Date.now();
      const difference = data.timeLock - now;
      if (difference <= 0 && !exists) {
        router.push('/game/explore/' + data?.map + '/' + data?.bee);
      }

      console.log('difference--->', difference, difference <= 0);

      setLockState(difference <= 0 && !exists);
    }
  }, [exists, data, router]); */

  const tabs = [
    {
      title: 'Select Arena',
      icon: <RankingIcon />,
      onClick: () => router.push('/game/explore/easy'),
    },
    {
      title: 'Explorations',
      icon: <StatsIcon />,
      onClick: () => router.push('/game/explore/my-explorations'),
    },
  ];
  return (
    <>
      <div className="w-full bg-cover bg-center flex flex-col justify-between p-4">
        <TabsPambii
          tabs={tabs}
          mode="background"
          bg="#2a2a2a"
          className="mt-4 mb-2 w-full"
        />
        <CardPambii
          type={cardType}
          className="bg-gray-200 w-full card-pambii-b text-black flex items-center justify-center"
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
          {!lockState ? (
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
              onClick={() => {
                console.log('clock', data, bee);
                router.push('/game/explore/' + bee + '/' + data.bee);
              }}
              icon={
                <Image
                  src="/assets/bee-characters/icons/explore-icon.svg"
                  alt="Select arena"
                  width={24}
                  height={24}
                />
              }
            >
              View Exploration state
            </ButtonPambii>
          )}
        </CardPambii>
      </div>
    </>
  );
};

export default ExplorePage;
