import { useEffect } from 'react';

type OnBackButtonPressed = () => void;

const useTelegramGameBackButton = (
  onBackButtonPressed: OnBackButtonPressed,
) => {
  useEffect(() => {
    const tg = (window as any).Telegram.WebApp;

    if (tg) {
      console.log('Telegram WebApp initialized');

      // Define el comportamiento al recibir el evento 'back_button_pressed'
      const handleBackButtonPressed = () => {
        console.log('Botón de retroceso presionado');
        if (onBackButtonPressed) {
          onBackButtonPressed();
        }
      };

      // Simula recibir el evento de TelegramGameProxy
      (window as any).TelegramGameProxy = {
        receiveEvent: (eventName: string, eventData: any) => {
          if (eventName === 'back_button_pressed') {
            handleBackButtonPressed();
          }
        },
      };

      // Simula la recepción del evento 'back_button_pressed'
      (window as any).TelegramGameProxy.receiveEvent(
        'back_button_pressed',
        null,
      );

      return () => {
        // Limpia el evento cuando el componente se desmonte
        (window as any).TelegramGameProxy = null;
      };
    } else {
      console.error('Telegram WebApp no se pudo inicializar');
    }
  }, [onBackButtonPressed]);
};

export default useTelegramGameBackButton;
