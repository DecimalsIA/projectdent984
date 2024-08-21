'use client';

import AbilitiesPambii from '@/components/AbilitiesPambii';
import SlidePambiiBee from '@/components/SlidePambiiBee';
import { useTelegram } from '@/context/TelegramContext';
import useFetchBees from '@/hooks/useFetchBees';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BadgePambii, ButtonPambii, CardPambii } from 'pambii-devtrader-front';
import { useState, useEffect } from 'react';

const BattlePage: React.FC = () => {
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';
  const { data, loading, error: errorBee } = useFetchBees(userid);
  const [imgSrc, setImgSrc] = useState('/assets/bee-characters/icons/fire.svg');

  const slideData = data && data.length > 0 ? data : [];
  console.log('slideData', slideData);

  // const [cardType, setCardType] = useState<string>('fire');
  const [abilitiesData, setAbilitiesData] = useState<any>([]);
  // const [habilities, setHabilities] = useState<any>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const router = useRouter();

  // Usa un efecto para actualizar los estados una vez que slideData esté disponible
  useEffect(() => {
    if (slideData.length > 0) {
      //  setCardType(slideData[0].type);
      setAbilitiesData(slideData[currentSlide].abilitiesData ?? []);
      //setHabilities(slideData[0].habilities ?? []);
    }
  }, [slideData]);

  const handleSelectArena = () => {
    // alert(cardType);
    router.push('/game/battle/select-arena');
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide > 0 ? prevSlide - 1 : slideData.length - 1;
      //  setCardType(slideData[newSlide].type);
      setAbilitiesData(slideData[newSlide].abilitiesData ?? []);
      // setHabilities(slideData[newSlide].habilities ?? []);
      return newSlide;
    });
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => {
      const newSlide = prevSlide < slideData.length - 1 ? prevSlide + 1 : 0;
      //setCardType(slideData[newSlide].type);
      setAbilitiesData(slideData[newSlide].abilitiesData ?? []);
      //   setHabilities(slideData[newSlide].habilities ?? []);
      return newSlide;
    });
  };
  const handleImageError = () => {
    setImgSrc('/assets/bee-characters/icons/fire.svg'); // Cambia esta ruta por tu imagen de placeholder
  };

  if (loading) return <div>Loading...</div>;
  if (errorBee) return <div>{errorBee}</div>;

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <CardPambii
        type={'fire'}
        className="bg-gray-200 w-full text-black card-pambii-b flex items-center justify-center"
      >
        <div className="w-full flex flex-row justify-center flex-wrap gap-1">
          <SlidePambiiBee
            slides={slideData}
            className="w-full"
            onPrevSlide={handlePrevSlide}
            onNextSlide={handleNextSlide}
          />
        </div>
        {slideData[currentSlide]?.parts &&
        slideData[currentSlide].parts.length > 0 ? (
          <div className="flex  overflow-x-auto max-w-full min-w-[320px]">
            <div className="flex flex-wrap space-x-1 gap-2 ">
              {slideData[currentSlide].parts.map((power, index) => (
                <BadgePambii
                  key={index}
                  icon={
                    <Image
                      src={
                        '/assets/bee-characters/icons/' +
                        power.typePart.toLowerCase() +
                        '.svg'
                      }
                      alt={power.typePart}
                      width={20}
                      height={20}
                      id={index.toString()}
                      onError={handleImageError}
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

        {slideData[currentSlide]?.power &&
        slideData[currentSlide].power.length > 0 ? (
          <div className="flex  overflow-x-auto max-w-full min-w-[320px]">
            <div className="flex flex-wrap space-x-1 gap-2 ">
              {slideData[currentSlide].power.map((power, index) => (
                <BadgePambii
                  key={index}
                  icon={
                    <Image
                      src={
                        '/assets/bee-characters/icons/' + power.name + '.svg'
                      }
                      alt={power.name}
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

        {abilitiesData && abilitiesData.length > 0 && (
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
