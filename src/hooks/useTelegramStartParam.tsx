import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

const useTelegramStartParam = (): string | undefined => {
  const [startParam, setStartParam] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const param = window.Telegram.WebApp.initDataUnsafe.start_param;
      setStartParam(param);
      console.log('Parametro recibido:', param);
    } else {
      console.error('Telegram WebApp no está disponible.');
    }
  }, []);

  return startParam;
};

export default useTelegramStartParam;
