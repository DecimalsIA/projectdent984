'use client';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import bgImgeHome from '../../assets/bg-home.png';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import {
  BadgePambii,
  ButtonPambii,
  CardPambii,
  FireIcon,
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

import Image from 'next/image';
import useGetExplorer from '@/hooks/usGetExplorer';
import ModalPambii from '@/components/ModalPambii';
import useFetchBees from '@/hooks/useFetchBees';

function formatLargeNumber(number: number) {
  const units = ['B', 'M', 'K'];
  const thresholds = [1e9, 1e6, 1e3];

  for (let i = 0; i < thresholds.length; i++) {
    if (number >= thresholds[i]) {
      const value = (number / thresholds[i]).toFixed(0);
      return `${value} ${units[i]}`;
    }
  }

  return number.toString();
}

const updateDocument = async (
  collectionName: string,
  documentId: string,
  updatedData: any,
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, updatedData);
    console.log('Document successfully updated!');
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

const Home = () => {
  const router = useRouter();
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';

  // Hooks de datos
  const { data, loading, error: errorBee } = useFetchBees(userid);
  const { totalPayout, experience } = useGetExplorer(userid);

  // Estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [abilitiesData, setAbilitiesData] = useState<any>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setAbilitiesData(data[currentSlide]?.abilitiesData ?? []);
      setInputValue(data[currentSlide]?.title ?? '');
    }
  }, [currentSlide, data]);

  if (loading) return <div>Loading...</div>;
  if (errorBee) return <div>{errorBee}</div>;

  const slideData = data && data.length > 0 ? data : [];

  console.log('slideData', slideData);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleChangeName = async () => {
    const updatedData = {
      'bee.title': inputValue,
    };
    await updateDocument('BEES', slideData[currentSlide].id, updatedData);
    setIsModalOpen(false);
  };

  const handleModal = () => {
    setIsModalOpen(true);
  };

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

  const modalData = {
    title: 'Change name of bee : ' + slideData[currentSlide]?.title,
    body: (
      <input
        type="text"
        id="textInput"
        value={inputValue}
        onChange={handleChange}
        className="w-full inpurModal"
        ref={inputRef}
        placeholder={slideData[currentSlide]?.title}
      />
    ),
    buttons: [
      {
        text: 'Change name of bee',
        bg: '#4068f5',
        color: 'white',
        w: 'full',
        icon: <PencilIcon />,
        onClick: handleChangeName,
      },
    ],
    onClose: () => setIsModalOpen(false),
  };

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
              {isModalOpen && <ModalPambii className="p-4" data={modalData} />}
              <UserHome userName={`${user?.first_name} ${user?.last_name}`} />
              {slideData[currentSlide]?.powers &&
              slideData[currentSlide].powers.length > 0 ? (
                <div className="flex  overflow-x-auto max-w-full min-w-[320px]">
                  <div className="flex flex-wrap space-x-1 gap-2 ">
                    {slideData[currentSlide].powers.map((power, index) => (
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
                    ))}
                  </div>
                </div>
              ) : (
                <div>No powers available</div>
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
                    onClick={handleModal}
                    color="#fff"
                    className="fz15"
                    icon={<PencilIcon />}
                  >
                    EDIT BEE
                  </ButtonPambii>
                </div>

                <div className=" w-full ml-3">
                  <ButtonPambii
                    onClick={() =>
                      alert(
                        'Withdraw the ' +
                          formatLargeNumber(totalPayout) +
                          ' PAMBII',
                      )
                    }
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
