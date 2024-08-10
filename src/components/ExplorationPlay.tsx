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
  existPay: boolean;
}

const ExplorationPlay: React.FC<ExplorationPlayProps> = ({
  existPay,
  bee,
  userId,
  slideData,
}) => {
  const [slideType, setSlideType] = useState<string>('');
  const [dificultad, setDificultad] = useState<any>('');
  const [exploration, setExploration] = useState<any>(null);

  const memoizedSlideData = useMemo(() => slideData, [slideData]);
  const memoizedBee = useMemo(() => bee, [bee]);

  const notify = useCallback(() => {
    toast.success('Hello, you Bee Currently under exploration');
  }, []);

  const validExplorer = useCallback(async (bee: any) => {
    const data = JSON.stringify({
      userId: userId,
      mapNumber: bee === 'easy' ? 1 : bee === 'middle' ? 2 : 3,
      valuePambii: bee === 'easy' ? 10 : bee === 'middle' ? 20 : 35,
      signature: '',
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/api/gexplore',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  const handleSelectArena = useCallback(
    async (slide: any, bee: any) => {
      console.log('slide', slide, bee);
      setSlideType(slide.type);
      setDificultad(bee);
      notify();
      try {
        let data = exploration; // Mantén el estado actual
        if (existPay) {
          data = await validExplorer(bee); // Solo llama a validExplorer si existPay es true
        }
        console.log(data);
        setExploration(data);
      } catch (error) {
        console.error('Error fetching explorer data:', error);
      }
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
            payout={exploration?.payout}
            multiplier={exploration?.multiplier}
          />
        </div>
      </CardPambii>
    </div>
  );
};

export default ExplorationPlay;
