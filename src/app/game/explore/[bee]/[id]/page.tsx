'use client';

import ExplorationInfo from '@/components/Exploration';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
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

  const { bees } = useGetBee(userId);
  const { data: beesData } = useFetchBees(userId);
  const { totalRecords, totalPayout, experience, win, loss } =
    useGetExplorer(userId);
  const [slideData, setSlideData] = useState<BeeData[]>([]);

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [lockState, setLockState] = useState(false);
  const { bee, id } = useParams();
  const router = useRouter();
  console.log('beesData', beesData);
  const { exists, data } = useVerifyPayment(userId);
  console.log(data);
  useEffect(() => {
    if (beesData && bees.length > 0) {
      const mappedSlideData: any[] = beesData
        .map((bee, index) => ({
          image: '/assets/bee-characters/' + bee.image + '.png',
          title: bee.title ? bee.title.toUpperCase() : 'UNKNOWN',
          abilitiesData: bee.abilitiesData,
          power: bee.powers && bee.powers.length > 0 ? bee.powers : null,
          progress: bee.progress,
          type: bee.type,
          id: bee.id,
          index: index,
        }))
        .filter((bee) => bee.id === id);

      setSlideData(mappedSlideData);
    }
  }, [bees, beesData, id]);

  useEffect(() => {
    if (exists && data) {
      const now = Date.now();
      const difference = data.timeLock - now;
      setLockState(difference <= 0);
    }
  }, [exists, data]);

  if (!bees || slideData.length === 0) {
    return (
      <div className="min-h-[100vh] flex flex-row items-center center-block">
        Loading...
      </div>
    ); // Muestra un indicador de carga mientras se inicializan los datos
  }
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
      <TabsPambii
        tabs={tabs}
        mode="background"
        bg="#2a2a2a"
        className="space-x-2"
      />
      <ExplorationPlay
        bee={beesData}
        type={bee}
        data={data}
        slideData={slideData[currentSlide]}
        userId={userId}
      />
    </>
  );
};

export default ExplorePage;
