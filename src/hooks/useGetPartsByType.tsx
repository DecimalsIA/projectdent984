import { useState, useEffect } from 'react';
import axios from 'axios';

interface BeePartGet {
  idPart: string;
  namePart: string;
  typePart: string;
  isAssigned: boolean;
  isForSale: boolean;
  ability: any;
  stats: {
    name: string;
    value: number;
  }[];
  beeId: string;
  slotId: string;
}

interface Category {
  title: string;
  parts: BeePart[];
  link: string;
}
interface BeePart {
  name: string;
  image: string;
  icon: string;
}

const useGetPartsByType = (userId: string, typePart?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const url = `/api/getPartsByType?userId=${userId}&typePart=${
          typePart || ''
        }`;
        const response = await axios.get<{
          partsByType: { [key: string]: BeePartGet[] };
        }>(url);
        const partsByType = response.data.partsByType;
        console.log('partsByType', partsByType);

        // Formatear en la estructura de categorías agrupadas por `typePart`
        const formattedCategories: Category[] = Object.keys(partsByType).map(
          (typePart) => ({
            title: typePart,
            parts: partsByType[typePart].map((part) => ({
              name: part.namePart,
              title: typePart,
              ability: part.ability,
              stats: part.stats,
              image: `/assets/bee-characters/category/${typePart.toLowerCase()}/${part.namePart.toLowerCase()}.png`, // Supongamos que las imágenes siguen este patrón de URL
              icon: `/assets/bee-characters/category/${typePart.toLowerCase()}.gif`, // Supongamos que los íconos siguen este patrón de URL
            })),
            link: `/game/inventory/category/${typePart.toLowerCase()}`, // Enlace para la categoría
          }),
        );

        setCategories(formattedCategories);
      } catch (err) {
        setError('Error fetching parts');
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [userId, typePart]);

  return { categories, loading, error };
};

export default useGetPartsByType;
