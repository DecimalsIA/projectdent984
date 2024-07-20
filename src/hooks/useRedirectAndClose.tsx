import { useCallback } from 'react';

const useRedirectAndClose = () => {
  const closeApp = useCallback((redirectUrl: string) => {
    // Mostrar un popup informando sobre la redirección
    window.Telegram.WebApp.showPopup(
      {
        message: 'Serás redirigido a otra página. ¿Deseas continuar?',
        buttons: [
          { text: 'Sí', id: 'yes' },
          { text: 'No', id: 'no' },
        ],
      },
      (buttonId: string) => {
        if (buttonId === 'yes') {
          // Redirigir a la URL especificada
          window.location.href = redirectUrl;

          // Cerrar la Web App después de un breve retraso
          setTimeout(() => {
            window.Telegram.WebApp.close();
          }, 1000); // 1000 milisegundos = 1 segundo
        }
      },
    );
  }, []);

  return { closeApp };
};

export default useRedirectAndClose;
