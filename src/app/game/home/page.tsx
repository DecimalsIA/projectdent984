'use client';
import React, { useEffect, useState } from 'react';
import bgImgeHome from '../../assets/bg-home.png';

import {
  BadgePambii,
  BeeIcon,
  ButtonPambii,
  CardPambii,
  FireIcon,
  ForceIcon,
  IconPambii,
  PencilIcon,
  ProgressBarPambii,
  RankingIcon,
  SlidePambii,
  StatsIcon,
  TabsPambii,
} from 'pambii-devtrader-front';
import UserHome from '@/components/UserHome';
import { useRouter } from 'next/navigation';
import { useTelegram } from '@/context/TelegramContext';
import useGetBee from '@/hooks/useGetBee';
import Image from 'next/image';
import { useAccountInfoToken } from '@/hooks/useAccountInfoToken';
import useGetExplorer from '@/hooks/usGetExplorer';

function formatLargeNumber(number: number) {
  const units = ['B', 'M', 'K'];
  const thresholds = [1e9, 1e6, 1e3];

  for (let i = 0; i < thresholds.length; i++) {
    if (number >= thresholds[i]) {
      const value = (number / thresholds[i]).toFixed(0);
      return `${value} ${units[i]}`;
    }
  }

  return number.toString(); // Return the original number if it's smaller than 1,000
}

const Home = () => {
  const router = useRouter();
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';
  const { bees, loading } = useGetBee(userid);
  const { accountInfo } = useAccountInfoToken(userid);
  const { totalPayout, experience } = useGetExplorer(userid);

  const slideData = bees.map((bee, index) => ({
    image: '/assets/bee-characters/' + bee.image + '.png',
    title: bee.title ? bee.title.toUpperCase() : 'UNKNOWN',
    abilitiesData: bee.abilitiesData,
    power: bee.powers && bee.powers.length > 0 ? bee.powers : null,
    progress: bee.progress,
    index: index,
  }));

  const [abilitiesData, setAbilitiesData] = useState<any>(
    slideData[0]?.abilitiesData ?? [],
  );
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (slideData.length > 0) {
      setAbilitiesData(slideData[currentSlide]?.abilitiesData ?? []);
    }
  }, [currentSlide, slideData]);

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide > 0 ? prevSlide - 1 : slideData.length - 1;
      setAbilitiesData(slideData[newSlide]?.abilitiesData ?? []);
      return newSlide;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide < slideData.length - 1 ? prevSlide + 1 : 0;
      setAbilitiesData(slideData[newSlide]?.abilitiesData ?? []);
      return newSlide;
    });
  };

  const tabs = [
    {
      title: 'Ranking',
      icon: <RankingIcon />,
      onClick: () => router.push('/game/ranking'),
    },
    {
      title: 'Stats',
      icon: <StatsIcon />,
      onClick: () => router.push('/game/stats'),
    },
  ];

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4"
      style={{ backgroundImage: 'url(' + bgImgeHome.src + ')' }}
    >
      <div className="mb-110">
        <div className="w-full">
          <TabsPambii
            tabs={tabs}
            mode="background"
            bg="#2a2a2a"
            className="mt-4 mb-8"
          />
          {!loading && slideData.length > 0 && (
            <SlidePambii
              slides={slideData}
              className="w-full mt-[10px] max-w-md mx-auto"
              onPrevSlide={handlePrevSlide}
              onNextSlide={handleNextSlide}
            />
          )}

          <div>
            <CardPambii className="beeCard w-full mt-2 min-w-[381px] ">
              <UserHome userName={`${user?.first_name} ${user?.last_name}`} />
              {slideData[currentSlide]?.power && (
                <div className="flex  overflow-x-auto max-w-full min-w-[320px]">
                  <div className="flex flex-wrap space-x-1 gap-2 ">
                    {slideData[currentSlide]?.power?.map((power, index) => (
                      <BadgePambii
                        key={index}
                        icon={
                          <Image
                            src={
                              '/assets/bee-characters/icons/' +
                              power.power.toLowerCase() +
                              '.png'
                            }
                            alt={power.power}
                            width={20}
                            height={20}
                            id={index.toString()}
                          />
                        }
                        number={power.value}
                        className="bg-border flex-grow badge"
                      />
                    ))}{' '}
                  </div>
                </div>
              )}
              {slideData[currentSlide]?.progress && (
                <div className="w-full border-b-m">
                  <ProgressBarPambii
                    level={slideData[currentSlide].progress.level}
                    current={experience}
                    max={slideData[currentSlide].progress.level * 100000}
                    barColor="bg-green-500 glow"
                    backgroundColor="bg-gray-700"
                  />
                </div>
              )}

              <div className="flex justify-between items-center w-full text-xs">
                <div className="w-full mr-3">
                  <ButtonPambii
                    titleText="POWER RATE"
                    color="#fff"
                    bg="#52BE97"
                    icon={<FireIcon style={{ color: '#fff' }} />}
                  >
                    1
                  </ButtonPambii>
                </div>
                <div className="w-full mt-[10px]">
                  <ButtonPambii
                    onClick={() => alert(slideData[currentSlide].title)}
                    color="#fff"
                    className="fz15"
                    icon={<PencilIcon />}
                  >
                    EDIT BEE
                  </ButtonPambii>
                </div>

                <div className=" w-full ml-3">
                  <ButtonPambii
                    onClick={() => alert('Battle button clicked')}
                    color="#fff"
                    titleText="PAMBII"
                    bg="#FF9E5D"
                    icon={<IconPambii />}
                  >
                    {formatLargeNumber(totalPayout)}
                  </ButtonPambii>
                </div>
              </div>
            </CardPambii>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
