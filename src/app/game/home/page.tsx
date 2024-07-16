/* eslint-disable @next/next/no-img-element */

'use client';
import React from 'react';
import bgImgeHome from '../../assets/bg-home.png';
import imgSprite from '../../assets/fuego1.png';
import {
  ActionButtonPambii,
  BadgePambii,
  BattleIcon,
  BeeIcon,
  ButtonPambii,
  CardPambii,
  ExploreIcon,
  FireIcon,
  ForceIcon,
  HomeIcon,
  IconPambii,
  InventoryIcon,
  MarketPlaceIcon,
  PencilIcon,
  ProgressBarPambii,
  RankingIcon,
  SettingIcon,
  SlidePambii,
  StatsIcon,
  TablePambii,
  TabsPambii,
  WalletIcon,
} from 'pambii-devtrader-front';
const Home = () => {
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
      title: 'Home',
      icon: <HomeIcon />,
      content: (
        <>
          {/* Main Content */}
          <div className="w-full">
            <div className="flex justify-between space-x-2">
              <div className="items-start z-10">
                <ActionButtonPambii
                  icon={<WalletIcon />}
                  onClick={() => alert('Battle button clicked')}
                />
              </div>

              <div className="items-end z-10">
                <ActionButtonPambii
                  icon={<SettingIcon />}
                  onClick={() => alert('Battle button clicked')}
                />
              </div>
            </div>
          </div>
          {/* Middle Section */}
          <SlidePambii
            slides={slideData}
            className="w-full mt-[-30px] max-w-md mx-auto"
          />
          {/* Bottom Section */}
          <div>
            <CardPambii className="beeCard w-full mt-2">
              <div className="flex space-x-2 w-full">
                <BadgePambii
                  icon={<FireIcon className="w-5 h-5" color="red" />}
                  number={250}
                  className="bg-border w-full"
                />
                <BadgePambii
                  icon={<FireIcon className="w-5 h-5" />}
                  number={150}
                  className="bg-border w-full"
                />
                <BadgePambii
                  icon={<FireIcon className="w-5 h-5" />}
                  number={350}
                  className="bg-border w-full"
                />
                <BadgePambii
                  icon={<FireIcon className="w-5 h-5" />}
                  number={450}
                  className="bg-border w-full"
                />
              </div>
              <div className="w-full border-b-m">
                <ProgressBarPambii
                  level={9}
                  current={2800}
                  max={3000}
                  barColor="bg-green-500"
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
                <div className="w-full mt-[28px]">
                  {' '}
                  <ButtonPambii
                    onClick={() => alert('Battle button clicked')}
                    color="#fff"
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
        </>
      ),
    },
    {
      title: 'Stats',
      icon: <StatsIcon />,
      content: (
        <>
          {' '}
          <section className="mb-8">
            <TablePambii data={beeData} />
          </section>
        </>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-between p-4"
      style={{ backgroundImage: 'url(' + bgImgeHome.src + ')' }}
    >
      {/* Top Navigation */}
      <div className="w-full mb-110">
        <div className="w-full">
          <TabsPambii
            tabs={tabs}
            mode="background"
            bg="#2a2a2a"
            className="mt-4"
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full fixedBotton p-3">
        <CardPambii className="beeCard w-full mb-[7px]">
          <div className="flex w-full ">
            <ActionButtonPambii
              icon={<BattleIcon />}
              text="BATTLE"
              onClick={() => alert('Battle button clicked')}
            />{' '}
            <ActionButtonPambii
              icon={<ExploreIcon />}
              text="EXPLORE"
              onClick={() => alert('Battle button clicked')}
            />{' '}
            <ActionButtonPambii
              icon={<RankingIcon />}
              text="RANKING"
              onClick={() => alert('Battle button clicked')}
            />
            <ActionButtonPambii
              icon={<MarketPlaceIcon />}
              text="MARKET"
              onClick={() => alert('Battle button clicked')}
            />
            <ActionButtonPambii
              icon={<InventoryIcon />}
              text="INVENTORY"
              href="https://example.com"
            />
          </div>
        </CardPambii>
      </div>
    </div>
  );
};

export default Home;
