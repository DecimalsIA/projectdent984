import { useState, useEffect, SetStateAction } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

const useGetExplorer = (userId: string) => {
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);
  const [experience, setExperience] = useState(0);
  const [explorer, setExplorers] = useState([]);
  const [win, setWin] = useState(0);
  const [loss, setLoss] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'explore_transaccion'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let recordsCount = 0;
      let payoutSum = 0;
      let exp = 0;
      let win = 0;
      let loss = 0;

      let explorerData: any = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Verificación adicional para asegurar que explorationPlay y payout existen
        if (
          data &&
          data.explorationPlay &&
          typeof data.explorationPlay.payout === 'number'
        ) {
          recordsCount += 1;
          payoutSum += data.explorationPlay.payout;
          exp += data.explorationPlay.experience;
          win += data.explorationPlay.win;
          loss += data.explorationPlay.loss;

          explorerData.push(data);
        } else {
          console.warn(
            'Missing or invalid explorationPlay/payout data in document:',
            doc.id,
          );
        }
      });

      setTotalRecords(recordsCount);
      setTotalPayout(payoutSum);
      setExperience(exp);
      setWin(win);
      setLoss(loss);
      setExplorers(explorerData);
    });

    return () => unsubscribe();
  }, [userId]);

  return { totalRecords, totalPayout, experience, win, loss, explorer };
};

export default useGetExplorer;
