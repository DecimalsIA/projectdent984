/* eslint-disable @next/next/no-img-element */

'use client';
import React from 'react';
import bgImgeHome from '../../assets/bg-home.png';
import imgSprite from '../../assets/fuego1.png';
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

const Home = () => {
  const router = useRouter();
  const handleClick = (name: string) => {
    alert(`Clicked on ${name}`);
  };
  const beeData = [
    {
      name: 'ABEJITACHULA',
      level: 9,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('ABEJITACHULA'),
    },
    {
      name: 'BEE NAME',
      level: 7,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 6,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 5,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 5,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 3,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 2,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
    {
      name: 'BEE NAME',
      level: 1,
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('BEE NAME'),
    },
  ];
  const slideData = [
    {
      image: imgSprite.src,
      title: 'ABEJITACHULA',
      power: 'Fire',
      powerIcon: <ForceIcon />,
    },
    {
      image: imgSprite.src,
      title: 'BEE NAME 2',
      power: 'Water',
      powerIcon: <ForceIcon />,
    },
    // Añade más objetos según sea necesario
  ];
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
      {/* Top Navigation */}
      <div className="mb-110">
        <div className="w-full">
          <TabsPambii
            tabs={tabs}
            mode="background"
            bg="#2a2a2a"
            className="mt-4 mb-8"
          />

          <SlidePambii
            slides={slideData}
            className="w-full mt-[10px] max-w-md mx-auto"
          />

          <div>
            <CardPambii className="beeCard w-full mt-2">
              <UserHome />
              <div className="flex space-x-2 w-full">
                <BadgePambii
                  icon={<FireIcon className="w-5 h-5" color="red" />}
                  number={250}
                  className="bg-border w-full badge"
                />
                <BadgePambii
                  icon={<FireIcon className="w-5 h-5" />}
                  number={150}
                  className="bg-border w-full badge"
                />
                <BadgePambii
                  icon={<FireIcon className="w-5 h-5" />}
                  number={350}
                  className="bg-border w-full badge"
                />
                <BadgePambii
                  icon={<FireIcon className="w-5 h-5" />}
                  number={450}
                  className="bg-border w-full badge"
                />
              </div>
              <div className="w-full border-b-m">
                <ProgressBarPambii
                  level={9}
                  current={2800}
                  max={3000}
                  barColor="bg-green-500 glow"
                  backgroundColor="bg-gray-700"
                />
              </div>

              <div className="flex justify-between items-center w-full text-xs">
                <div className="w-full mr-3">
                  <ButtonPambii
                    titleText="POWER RATE"
                    color="#fff"
                    bg="#52BE97"
                    icon={<FireIcon style={{ color: '#fff' }} />}
                  >
                    457
                  </ButtonPambii>
                </div>
                <div className="w-full mt-[10px]">
                  {' '}
                  <ButtonPambii
                    onClick={() => alert('Battle button clicked')}
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
                    8000
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
