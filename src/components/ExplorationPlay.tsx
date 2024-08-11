/* eslint-disable react-hooks/exhaustive-deps */
import { CardPambii } from 'pambii-devtrader-front';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ExplorationCardGame from './ExplorationCardGame';
import axios from 'axios';

import { toast } from 'react-hot-toast';

interface ExplorationPlayProps {
  bee: any;
  userId: string;
  slideData: any;
  data: any;
}

const ExplorationPlay: React.FC<ExplorationPlayProps> = ({
  bee,
  slideData,
  data,
}) => {
  const [slideType, setSlideType] = useState<string>('');
  const [dificultad, setDificultad] = useState<any>('');

  const memoizedSlideData = useMemo(() => slideData, [slideData]);
  const memoizedBee = useMemo(() => bee, [bee]);
  console.log('data', data);

  const handleSelectArena = useCallback(
    async (slide: any, bee: any) => {
      console.log('slide', slide, bee);
      setSlideType(slide.type);
      setDificultad(bee);
      // notify();
    },
    [], // Agregué existPay y exploration como dependencias para asegurar la coherencia
  );

  useEffect(() => {
    handleSelectArena(memoizedSlideData, memoizedBee);
  }, [handleSelectArena, memoizedSlideData, memoizedBee]);

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <CardPambii
        type={dificultad}
        className="bg-gray-200 w-full card-pambii-b text-black flex items-center justify-center"
      >
        <div className="w-full flex flex-row justify-center flex-wrap gap-1">
          <ExplorationCardGame
            bee={slideType}
            dificultad={dificultad}
            payout={data.explorationPlay.payout}
            multiplier={data.explorationPlay.multiplier}
          />
        </div>
      </CardPambii>
    </div>
  );
};

export default ExplorationPlay;
