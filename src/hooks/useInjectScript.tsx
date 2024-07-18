import { useEffect } from 'react';

const useInjectScript = (src: string, onLoad: () => void) => {
  useEffect(() => {
    // Crear el script
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Esto asegura que se cargue sincrónicamente y primero
    script.defer = false;
    script.onload = onLoad;

    // Insertar el script al principio del head
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript) {
      firstScript.parentNode?.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    // Eliminar el script al desmontar
    return () => {
      document.head.removeChild(script);
    };
  }, [src, onLoad]);
};

export default useInjectScript;
