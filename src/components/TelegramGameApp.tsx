import React, { useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
    TelegramGameProxy?: {
      receiveEvent: (eventName: string, eventData: any) => void;
    };
  }
}
const goBack = () => {
  if (document.referrer) {
    window.location.href = document.referrer;
  } else {
    window.history.back();
  }
};

const initializeTelegramWebApp = () => {
  const tg = window.Telegram.WebApp;

  const handleBackButtonPressed = () => {
    console.log('Botón de retroceso presionado');
    console.log('Se presionó el botón de retroceso. Redirigiendo...');
    goBack();
  };

  if (tg) {
    console.log('Telegram WebApp initialized');

    // Simula recibir el evento de TelegramGameProxy
    window.TelegramGameProxy = {
      receiveEvent: (eventName: string) => {
        if (eventName === 'back_button_pressed') {
          handleBackButtonPressed();
        }
      },
    };
  } else {
    console.error('Telegram WebApp no se pudo inicializar');
  }
};

const TelegramGameApp: React.FC = () => {
  const [initialized, setInitialized] = useState(false);

  if (!initialized) {
    initializeTelegramWebApp();
    setInitialized(true);
  }

  return <div>{/* Tu contenido aquí */}</div>;
};

export default TelegramGameApp;
