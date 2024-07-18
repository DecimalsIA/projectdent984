import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramContextProps {
  showBackButton: boolean;
  setShowBackButton: (visible: boolean) => void;
  setBackButtonClickHandler: (handler: () => void) => void;
  isScriptLoaded: boolean;
  user: TelegramUser | null;
}

const TelegramContext = createContext<TelegramContextProps | undefined>(
  undefined,
);

export const TelegramProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showBackButton, setShowBackButton] = useState(false);
  const [backButtonClickHandler, setBackButtonClickHandler] = useState<
    () => void
  >(() => {});
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isBackButtonHandlerSet, setIsBackButtonHandlerSet] = useState(false);

  useEffect(() => {
    const checkTelegram = setInterval(() => {
      if (window.Telegram?.WebApp) {
        clearInterval(checkTelegram);
        setIsScriptLoaded(true);
        setUser(window.Telegram.WebApp.initDataUnsafe?.user || null);
      }
    }, 100);

    return () => clearInterval(checkTelegram);
  }, []);

  useEffect(() => {
    if (isScriptLoaded && window.Telegram?.WebApp) {
      const handleBackButton = () => {
        backButtonClickHandler();
      };

      if (!isBackButtonHandlerSet) {
        window.Telegram.WebApp.onEvent('backButtonClicked', handleBackButton);
        setIsBackButtonHandlerSet(true);
      }

      if (showBackButton) {
        window.Telegram.WebApp.BackButton.show();
      } else {
        window.Telegram.WebApp.BackButton.hide();
      }

      return () => {
        if (isBackButtonHandlerSet) {
          window.Telegram.WebApp.offEvent(
            'backButtonClicked',
            handleBackButton,
          );
          setIsBackButtonHandlerSet(false);
        }
        window.Telegram.WebApp.BackButton.hide();
      };
    }
  }, [
    isScriptLoaded,
    showBackButton,
    backButtonClickHandler,
    isBackButtonHandlerSet,
  ]);

  return (
    <TelegramContext.Provider
      value={{
        showBackButton,
        setShowBackButton,
        setBackButtonClickHandler,
        isScriptLoaded,
        user,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = (): TelegramContextProps => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
