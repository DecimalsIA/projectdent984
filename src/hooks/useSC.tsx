import { useCallback } from 'react';
import { generatePhantomDeeplink } from '../utils/phantom';

export const useSC = () => {
  // Función para generar el deeplink
  const getPhantomUrl = useCallback(async (userId: string): Promise<string> => {
    try {
      const deeplink = await generatePhantomDeeplink(userId);
      return deeplink; // Retorna la URL generada
    } catch (error) {
      console.error('Error al generar el deeplink:', error);
      return ''; // Retorna un string vacío si hay un error
    }
  }, []);

  return {
    getPhantomUrl,
  };
};
