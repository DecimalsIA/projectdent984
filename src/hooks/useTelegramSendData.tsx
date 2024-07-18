import { useEffect } from 'react';

export const useTelegramSendData = (data: string): void => {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(data);
    }
  }, [data]);
};
