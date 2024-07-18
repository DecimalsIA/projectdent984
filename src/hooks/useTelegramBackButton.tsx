import { useEffect } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

interface UseTelegramBackButtonOptions {
  onBackPressed: () => void;
  visible: boolean;
}

export const useTelegramBackButton = ({
  onBackPressed,
  visible,
}: UseTelegramBackButtonOptions): void => {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton;

      const handleBackButton = () => {
        onBackPressed();
      };

      backButton.onClick(handleBackButton);

      if (visible) {
        backButton.show();
      } else {
        backButton.hide();
      }

      return () => {
        backButton.offClick(handleBackButton);
        backButton.hide();
      };
    }
  }, [onBackPressed, visible]);
};
