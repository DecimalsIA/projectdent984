'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTelegram } from '@/context/TelegramContext';
import { ButtonPambii } from 'pambii-devtrader-front';
import TelegramGameApp from '@/components/TelegramGameApp';
import ScComponent from '@/components/ScComponent';

const Game: React.FC = () => {
  return (
    <div>
      <h1>Pagina </h1>
      <p>Aquí va el contenido del juego.</p>

      <hr className="mt-10 mb-3" />
      <div>
        <h1>Perfil de Usuario</h1>

        <p>Contenido del perfil</p>
      </div>
      <ScComponent />
      <a
        href="https://phantom.app/ul/browse/https://pambii-front.vercel.app/game/explore/buy?ref=https://pambii-front.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ButtonPambii>BACK</ButtonPambii>
      </a>
    </div>
  );
};

export default Game;
