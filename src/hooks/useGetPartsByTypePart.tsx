import { useState, useEffect } from 'react';
import axios from 'axios';

interface BeePart {
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

const useGetPartsByTypePart = (
  userId: string,
  typePart?: string,
  part?: string,
) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const url = `/api/getPartsByType?userId=${userId}&typePart=${
          typePart || ''
        }&part=${part || ''}`;
        const response = await axios.get<{
          partsByType: { [key: string]: any[] };
        }>(url);
        const partsByType = response.data.partsByType;

        // Agrupar las partes por `namePart`
        const groupedByPartName: { [key: string]: any[] } = {};

        Object.values(partsByType).forEach((parts) => {
          parts.forEach((part) => {
            if (!groupedByPartName[part.namePart]) {
              groupedByPartName[part.namePart] = [];
            }
            groupedByPartName[part.namePart].push(part);
          });
        });

        // Formatear en la estructura de categorías
        const formattedCategories: Category[] = Object.keys(
          groupedByPartName,
        ).map((namePart) => ({
          title: namePart,
          parts: groupedByPartName[namePart].map((part) => ({
            ...part,
            name: part.namePart,
            image: `/assets/bee-characters/category/${part.typePart.toLowerCase()}/${namePart.toLowerCase()}.png`, // Supongamos que las imágenes siguen este patrón de URL
            typePart: part.typePart,
            icon: `/assets/bee-characters/category/${part.typePart.toLowerCase()}.gif`, // Supongamos que los íconos siguen este patrón de URL
          })),
          link: `/game/inventory/parts/${namePart.toLowerCase()}`, // Enlace para la categoría
        }));

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

export default useGetPartsByTypePart;
