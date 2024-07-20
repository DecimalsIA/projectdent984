import { useCallback } from 'react';

const useRedirectAndClose = () => {
  const closeApp = useCallback((redirectUrl: string) => {
    const redirectToUrl = (url: string) => {
      // Crear un iframe para cargar la URL de redirección
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
    };

    redirectToUrl(redirectUrl);

    // Cerrar la Web App después de un breve retraso
    const timeoutId = setTimeout(() => {
      window.Telegram.WebApp.close();
    }, 5000); // 1000 milisegundos = 1 segundo

    // Cleanup function to clear timeout if component unmounts
    return () => {
      clearTimeout(timeoutId);
      const iframe = document.querySelector(`iframe[src="${redirectUrl}"]`);
      if (iframe) {
        document.body.removeChild(iframe);
      }
    };
  }, []);

  return { closeApp };
};

export default useRedirectAndClose;
