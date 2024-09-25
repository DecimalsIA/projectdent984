/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useTelegram } from '@/context/TelegramContext';
import useVerifyPayment from '@/hooks/useVerifyPayment';
import useGetBee from '@/hooks/useGetBee';
import useGetExplorer from '@/hooks/usGetExplorer';
import useFetchBees from '@/hooks/useFetchBees';
import TransactionComponent from '@/components/TransactionComponent';
import SlidePambiiBee from '@/components/SlidePambiiBee';
import ExplorationInfo from '@/components/Exploration';
import {
  ButtonPambii,
  CardPambii,
  TabsPambii,
  RankingIcon,
  StatsIcon,
} from 'pambii-devtrader-front';
import Image from 'next/image';

const ExplorePage: React.FC = () => {
  const { user } = useTelegram();
  const userId = user?.id?.toString() ?? '792924145';
  const router = useRouter();

  const { bees } = useGetBee(userId);
  const { data: beesData } = useFetchBees(userId);
  const { totalRecords, totalPayout, experience, win, loss } =
    useGetExplorer(userId);
  const [slideData, setSlideData] = useState<any[]>([]);
  const [cardType, setCardType] = useState<string>('');
  const [abilitiesData, setAbilitiesData] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [lockState, setLockState] = useState(false);

  const { exists, data } = useVerifyPayment(userId);

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

  useEffect(() => {
    // Este useEffect solo se ejecutará cuando `exists` o `data` cambien
    if (exists && data) {
      console.log('La transacción existe y los datos son:', data);
      const now = Date.now();
      const difference = data.timeLock - now;
      if (difference <= 0) {
        console.log('La transacción ha expirado.');
      } else {
        router.push('/game/explore/' + data?.map + '/' + data?.bee);
      }
    } else {
      console.log('No se encontraron transacciones para el usuario.');
    }
  }, [exists, data, router]);

  useEffect(() => {
    if (beesData && bees && bees.length > 0) {
      setSlideData(beesData);
      setCardType(beesData[0]?.type || '');
      setAbilitiesData(beesData[0]?.abilitiesData || []);
    }
  }, [bees, beesData]);

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

  const { bee } = useParams();

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
      <div className="w-full bg-cover bg-center flex flex-col justify-start flex-nowrap p-4 full-h">
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
              <SlidePambiiBee
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
              bee={slideData[currentSlide]?.id}
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
