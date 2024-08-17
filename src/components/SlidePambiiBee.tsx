import React, { useState } from 'react';
import classNames from 'classnames';
import Bee from './Bee';

type Powers = {
  power: string;
  powerIcon?: React.ReactNode;
};
type Habilites = {
  name: string;
  icon?: React.ReactNode;
};

type SlideData = {
  image?: string; // URL de la imagen opcional
  parts?: any[]; // URL de la imagen opcional
  component?: React.ReactNode; // Componente opcional
  title?: string;
  powers?: Powers[];
  habilites?: Habilites[];
  subtittle?: string;
};

type SlidePambiiProps = {
  slides: SlideData[];
  className?: string;
  onPrevSlide?: () => void; // Nueva prop
  onNextSlide?: () => void; // Nueva prop
};

const SlidePambiiBee: React.FC<SlidePambiiProps> = ({
  slides,
  className,
  onPrevSlide,
  onNextSlide,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    if (onNextSlide) {
      onNextSlide();
    }
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length,
    );
    if (onPrevSlide) {
      onPrevSlide();
    }
  };
  const partsByKey = slides[currentIndex]?.parts?.reduce((acc, part) => {
    acc[part.namePart] = part;
    return acc;
  }, {});

  return (
    <>
      <div className={classNames('relative flex items-center', className)}>
        <button className="absolute left-0" onClick={prevSlide}>
          <svg
            width="18"
            height="30"
            viewBox="0 0 18 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.01012 14.2284L14.8236 0.833158C15.6856 -0.00268124 17.3333 0.503972 17.3333 1.60484L17.3333 28.3952C17.3333 29.4961 15.6856 30.0028 14.8236 29.1669L1.01012 15.7717C0.552198 15.3277 0.552199 14.6724 1.01012 14.2284Z"
              fill="white"
            />
          </svg>
        </button>
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-white font-bold">{slides[currentIndex].title}</h2>
          {slides[currentIndex].subtittle && (
            <h3 className="explore-sub">{slides[currentIndex].subtittle}</h3>
          )}

          {slides[currentIndex].parts &&
            slides[currentIndex].parts[0]?.typePart && (
              <Bee
                basePathW={partsByKey?.['wings']?.typePart?.toLowerCase() || ''}
                basePathH={partsByKey?.['head']?.typePart?.toLowerCase() || ''}
                basePathF={
                  partsByKey?.['frontLegs']?.typePart?.toLowerCase() || ''
                }
                basePathHi={
                  partsByKey?.['hindLegs']?.typePart?.toLowerCase() || ''
                }
                basePathSt={
                  partsByKey?.['stinger']?.typePart?.toLowerCase() || ''
                }
                basePathT={partsByKey?.['torso']?.typePart?.toLowerCase() || ''}
              />
            )}
          {slides[currentIndex].component && (
            <div className="slide-component">
              {slides[currentIndex].component}
            </div>
          )}
        </div>
        <button className="absolute right-0" onClick={nextSlide}>
          <svg
            width="18"
            height="30"
            viewBox="0 0 18 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.9899 14.2283L3.1764 0.833078C2.31446 -0.00276176 0.666673 0.503892 0.666673 1.60476L0.666672 28.3952C0.666672 29.496 2.31446 30.0027 3.1764 29.1668L16.9899 15.7716C17.4478 15.3276 17.4478 14.6723 16.9899 14.2283Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      {slides[currentIndex].powers && (
        <div className="flex justify-center  flex-wrap mt-2 space-x-4 gap-2">
          {slides[currentIndex].powers?.map((power, index) => (
            <div key={index} className="flex items-center badge-power m-1">
              {power.powerIcon}
              <span className="text-white ml-2">{power.power}</span>
            </div>
          ))}
        </div>
      )}
      {slides[currentIndex].powers && (
        <div className="flex justify-center  flex-wrap mt-2 space-x-4 gap-2">
          {slides[currentIndex].habilites?.map((habilite, index) => (
            <div key={index} className="flex items-center badge-power m-1">
              {habilite.icon}
              <span className="text-white ml-2">{habilite.name}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SlidePambiiBee;
