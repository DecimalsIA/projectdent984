import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface BeePartGet {
  idPart: string;
  namePart: string;
  typePart: string;
  isAssigned: boolean;
  isForSale: boolean;
  ability: {
    id: string;
    name: string;
    description: string;
  };
  stats: {
    name: string;
    value: number;
  }[];
  beeId: string;
  slotId: string;
}

interface Category {
  title: string;
  parts: any[];
  link: string;
}
interface BeePart {
  name: string;
  image: string;
  icon: string;
}

const useGetPartsMarketPlaceByType = (userId: string, typePart?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisibleId, setLastVisibleId] = useState<string | null>(null); // Estado para manejar la paginación
  const [hasMore, setHasMore] = useState<boolean>(true); // Estado para saber si hay más datos que cargar

  const fetchParts = useCallback(
    async (lastId: string | null = null) => {
      try {
        setLoading(true);

        // Crear la URL con los parámetros para paginación
        let url = `/api/getPartByMarketPlace?userId=${userId}&typePart=${
          typePart || ''
        }&pageSize=30`;
        if (lastId) {
          url += `&lastVisibleId=${lastId}`;
        }

        const response = await axios.get<{
          partsByType: { [key: string]: BeePartGet[] };
          lastVisibleId: string;
        }>(url);

        const partsByType = response.data.partsByType;

        // Formatear en la estructura de categorías agrupadas por `typePart`
        const formattedCategories: Category[] = Object.keys(partsByType).map(
          (typePart) => ({
            title: typePart,
            parts: partsByType[typePart].map((part) => ({
              ...part,
              name: part.namePart,
              image: `/assets/bee-characters/category/${typePart.toLowerCase()}/${part.namePart.toLowerCase()}.png`, // Supongamos que las imágenes siguen este patrón de URL
              icon: `/assets/bee-characters/category/${typePart.toLowerCase()}.gif`, // Supongamos que los íconos siguen este patrón de URL
            })),
            link: `/game/inventory/category/${typePart.toLowerCase()}`, // Enlace para la categoría
          }),
        );

        // Si es la primera página, reemplaza las categorías, de lo contrario, añade a las existentes
        setCategories((prevCategories) =>
          lastId
            ? [...prevCategories, ...formattedCategories]
            : formattedCategories,
        );

        // Actualiza el lastVisibleId para la siguiente carga
        setLastVisibleId(response.data.lastVisibleId);

        // Verifica si hay más partes por cargar
        setHasMore(!!response.data.lastVisibleId);
      } catch (err) {
        setError('Error fetching parts');
      } finally {
        setLoading(false);
      }
    },
    [userId, typePart],
  );

  useEffect(() => {
    // Cada vez que userId o typePart cambien, inicia desde el principio
    setCategories([]);
    setLastVisibleId(null);
    fetchParts();
  }, [userId, typePart, fetchParts]);

  // Función para cargar más partes (paginación)
  const loadMore = () => {
    if (hasMore && !loading) {
      fetchParts(lastVisibleId);
    }
  };

  return { categories, loading, error, loadMore, hasMore };
};

export default useGetPartsMarketPlaceByType;
