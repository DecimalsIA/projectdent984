'use client';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

interface Power {
  power: string;
  icon: string;
  value: number;
}
interface Progress {
  level: number;
  current: number;
  max: number;
}

interface Ability {
  id: number;
  name: string;
  icon: string;
}

interface Bee {
  image: string;
  title: string;
  type: string;
  id: string;
  progress: Progress;
  powers: Power[];
  abilitiesData: Ability[];
  habilities: Ability[];
}

const useGetBee = (userId: string) => {
  const [bees, setBees] = useState<Bee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, 'BEES'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const beeList: Bee[] = [];
        querySnapshot.forEach((doc) => {
          console.log('doc', doc);
          const data = doc.data();
          try {
            const formattedData: Bee = {
              image: data?.bee?.image || '',
              title: data?.bee?.title || '',
              type: data?.bee?.type || 'fire',
              id: data?.id || 0,
              progress: {
                level: data?.bee?.level || 1,
                current: data?.bee?.current || 1,
                max: data?.bee?.max || 100,
              },
              powers: (data?.bee?.powers || []).map((power: any) => ({
                power: power?.power || '',
                icon: power?.icon || '',
                value: power?.value || 1,
              })),
              abilitiesData: (data?.bee?.abilitiesData || []).map(
                (ability: any) => ({
                  id: ability?.id || 0,
                  name: ability?.name || '',
                  icon: ability?.icon?.props?.src || '',
                }),
              ),
              habilities: (data?.habilities || []).map((hability: any) => ({
                name: hability?.name || '',
                icon: hability?.icon?.props?.src || '',
              })),
            };
            beeList.push(formattedData);
          } catch (err) {
            console.error('Error formatting data: ', err);
            setError('Error formatting data');
          }
        });
        setBees(beeList);
        setLoading(false);
      },
      (error: FirestoreError) => {
        console.error('Error fetching data: ', error);
        setError('Error fetching data');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  return { bees, loading, error };
};

export default useGetBee;
