import { useEffect, useState } from 'react';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: object;
  headerColor(color: string): void;
  backgroundColor(color: string): void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    progressVisible: boolean;
    setText(text: string): void;
    setColor(color: string): void;
    setTextColor(color: string): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(): void;
    hideProgress(): void;
    onClick(callback: () => void): void;
  };
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
  };
  HapticFeedback: {
    impactOccurred(style: string): void;
    notificationOccurred(type: string): void;
    selectionChanged(): void;
  };
  close(): void;
  scanQrCode(callback: (data: string) => void): void;
  showPopup(params: object, callback: () => void): void;
  requestContact(callback: (contact: { phoneNumber: string }) => void): void;
  requestLocation(
    callback: (location: { latitude: number; longitude: number }) => void,
  ): void;
  openLink(url: string): void;
  openInvoice(
    invoiceLink: string,
    callback: (status: { status: string }) => void,
  ): void;
  toggleMinimalView(): void;
}

interface TelegramGameProxy {
  receiveEvent(eventType: string, eventData: any): void;
  onEvent(callback: (eventType: string, eventData: any) => void): void;
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
  TelegramGameProxy?: TelegramGameProxy;
}

declare const window: Window;

const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.Telegram?.WebApp) {
        setIsReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const WebApp = isReady ? window.Telegram?.WebApp : null;
  const GameProxy = isReady ? window.TelegramGameProxy : null;

  const log = (message: string, ...args: any[]) => {
    console.log(`[Telegram WebApp] ${message}`, ...args);
  };

  const handleError = (error: any) => {
    const errorData = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      ...error,
    };
    alert(JSON.stringify(errorData, null, 2));
  };

  const enhancedWebApp = WebApp && {
    ...WebApp,
    headerColor: (color: string) => {
      try {
        log('headerColor', color);
        WebApp.headerColor(color);
      } catch (error) {
        handleError(error);
      }
    },
    backgroundColor: (color: string) => {
      try {
        log('backgroundColor', color);
        WebApp.backgroundColor(color);
      } catch (error) {
        handleError(error);
      }
    },
    MainButton: {
      ...WebApp.MainButton,
      setText: (text: string) => {
        try {
          log('MainButton.setText', text);
          WebApp.MainButton.setText(text);
        } catch (error) {
          handleError(error);
        }
      },
      setColor: (color: string) => {
        try {
          log('MainButton.setColor', color);
          WebApp.MainButton.setColor(color);
        } catch (error) {
          handleError(error);
        }
      },
      setTextColor: (color: string) => {
        try {
          log('MainButton.setTextColor', color);
          WebApp.MainButton.setTextColor(color);
        } catch (error) {
          handleError(error);
        }
      },
      show: () => {
        try {
          log('MainButton.show');
          WebApp.MainButton.show();
        } catch (error) {
          handleError(error);
        }
      },
      hide: () => {
        try {
          log('MainButton.hide');
          WebApp.MainButton.hide();
        } catch (error) {
          handleError(error);
        }
      },
      enable: () => {
        try {
          log('MainButton.enable');
          WebApp.MainButton.enable();
        } catch (error) {
          handleError(error);
        }
      },
      disable: () => {
        try {
          log('MainButton.disable');
          WebApp.MainButton.disable();
        } catch (error) {
          handleError(error);
        }
      },
      showProgress: () => {
        try {
          log('MainButton.showProgress');
          WebApp.MainButton.showProgress();
        } catch (error) {
          handleError(error);
        }
      },
      hideProgress: () => {
        try {
          log('MainButton.hideProgress');
          WebApp.MainButton.hideProgress();
        } catch (error) {
          handleError(error);
        }
      },
      onClick: (callback: () => void) => {
        try {
          log('MainButton.onClick');
          WebApp.MainButton.onClick(callback);
        } catch (error) {
          handleError(error);
        }
      },
    },
    BackButton: {
      ...WebApp.BackButton,
      show: () => {
        try {
          log('BackButton.show');
          WebApp.BackButton.show();
        } catch (error) {
          handleError(error);
        }
      },
      hide: () => {
        try {
          log('BackButton.hide');
          WebApp.BackButton.hide();
        } catch (error) {
          handleError(error);
        }
      },
      onClick: (callback: () => void) => {
        try {
          log('BackButton.onClick');
          WebApp.BackButton.onClick(callback);
        } catch (error) {
          handleError(error);
        }
      },
    },
    HapticFeedback: {
      ...WebApp.HapticFeedback,
      impactOccurred: (style: string) => {
        try {
          log('HapticFeedback.impactOccurred', style);
          WebApp.HapticFeedback.impactOccurred(style);
        } catch (error) {
          handleError(error);
        }
      },
      notificationOccurred: (type: string) => {
        try {
          log('HapticFeedback.notificationOccurred', type);
          WebApp.HapticFeedback.notificationOccurred(type);
        } catch (error) {
          handleError(error);
        }
      },
      selectionChanged: () => {
        try {
          log('HapticFeedback.selectionChanged');
          WebApp.HapticFeedback.selectionChanged();
        } catch (error) {
          handleError(error);
        }
      },
    },
    close: () => {
      try {
        log('close');
        WebApp.close();
      } catch (error) {
        handleError(error);
      }
    },
    scanQrCode: (callback: (data: string) => void) => {
      try {
        log('scanQrCode');
        WebApp.scanQrCode(callback);
      } catch (error) {
        handleError(error);
      }
    },
    showPopup: (params: object, callback: () => void) => {
      try {
        log('showPopup', params);
        WebApp.showPopup(params, callback);
      } catch (error) {
        handleError(error);
      }
    },
    requestContact: (callback: (contact: { phoneNumber: string }) => void) => {
      try {
        log('requestContact');
        WebApp.requestContact(callback);
      } catch (error) {
        handleError(error);
      }
    },
    requestLocation: (
      callback: (location: { latitude: number; longitude: number }) => void,
    ) => {
      try {
        log('requestLocation');
        WebApp.requestLocation(callback);
      } catch (error) {
        handleError(error);
      }
    },
    openLink: (url: string) => {
      try {
        log('openLink', url);
        WebApp.openLink(url);
      } catch (error) {
        handleError(error);
      }
    },
    openInvoice: (
      invoiceLink: string,
      callback: (status: { status: string }) => void,
    ) => {
      try {
        log('openInvoice', invoiceLink);
        WebApp.openInvoice(invoiceLink, callback);
      } catch (error) {
        handleError(error);
      }
    },
    toggleMinimalView: () => {
      try {
        log('toggleMinimalView');
        WebApp.toggleMinimalView();
      } catch (error) {
        handleError(error);
      }
    },
  };

  const enhancedGameProxy = GameProxy && {
    ...GameProxy,
    receiveEvent: (eventType: string, eventData: any) => {
      try {
        log('GameProxy.receiveEvent', eventType, eventData);
        GameProxy.receiveEvent(eventType, eventData);
      } catch (error) {
        handleError(error);
      }
    },
    onEvent: (callback: (eventType: string, eventData: any) => void) => {
      try {
        log('GameProxy.onEvent');
        GameProxy.onEvent(callback);
      } catch (error) {
        handleError(error);
      }
    },
  };

  return {
    WebApp: enhancedWebApp,
    GameProxy: enhancedGameProxy,
    isReady,
  };
};

export default useTelegram;
