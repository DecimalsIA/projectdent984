import { useState, useEffect } from 'react';
import axios from 'axios';

interface Bee {
  id: string;
  image: string;
  title: string;
  type: string;
  powers: any[];
  habilities: any[];
  abilitiesData: any[];
  state: boolean;
  createdAt: string;
  hashId: string;
}

const useFetchBees = (userId: string) => {
  const [data, setData] = useState<Bee[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBees = async () => {
      try {
        setLoading(true);
        const url = `/api/getBees?userId=${userId}`;
        const response = await axios.get<{ bees: Bee[] }>(url);
        setData(response.data.bees);
      } catch (err) {
        setError('Error fetching bees');
      } finally {
        setLoading(false);
      }
    };

    fetchBees();
  }, [userId]);

  return { data, loading, error };
};

export default useFetchBees;
