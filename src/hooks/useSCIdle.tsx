import { generatePhantomDeeplinkIdle } from '@/utils/generatePhantomDeeplink';
import { useCallback } from 'react';

export const useSC = () => {
  // Función para generar el deeplink
  const getPhantomUrl = useCallback(async (userId: string): Promise<string> => {
    try {
      const deeplink = await generatePhantomDeeplinkIdle(userId, 'buyId');
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
// generatePhantomDeeplink
