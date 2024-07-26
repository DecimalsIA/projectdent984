'use client';

import ExplorationCardGame from '@/components/ExplorationCardGame';

import { CardPambii } from 'pambii-devtrader-front';
import { useState } from 'react';

const ExplorePage: React.FC = () => {
  const [cardType, setCardType] = useState<string>('fire');

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
      <CardPambii
        type={cardType}
        className="bg-gray-200 w-full card-pambii-b  text-black flex items-center justify-center"
      >
        <div className="w-full flex flex-row justify-center flex-wrap gap-1">
          <ExplorationCardGame />
        </div>
      </CardPambii>
    </div>
  );
};

export default ExplorePage;
