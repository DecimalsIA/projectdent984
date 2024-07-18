'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTelegram } from '@/context/TelegramContext';
import { ButtonPambii } from 'pambii-devtrader-front';
import TelegramGameApp from '@/components/TelegramGameApp';

const Game: React.FC = () => {
  const { showBackButton, setShowBackButton, setBackButtonClickHandler, user } =
    useTelegram();

  useEffect(() => {
    setShowBackButton(true);
  }, [setBackButtonClickHandler, setShowBackButton]);

  return (
    <div>
      <TelegramGameApp />
      <h1>Pagina </h1>
      <p>Aquí va el contenido del juego.</p>

      <hr className="mt-10 mb-3" />
      <div>
        <h1>Perfil de Usuario</h1>
        <p>Nombre: {user?.first_name}</p>
        <p>Apellido: {user?.last_name}</p>
        <p>Username: {user?.username}</p>

        <p>Contenido del perfil</p>
      </div>
      <Link href="/">
        <ButtonPambii>BACK</ButtonPambii>{' '}
      </Link>
    </div>
  );
};

export default Game;
