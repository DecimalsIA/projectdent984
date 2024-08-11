import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

interface PaymentData {
  exists: boolean;
  data: any | null;
}

const useVerifyPayment = (userId: string): PaymentData => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    exists: false,
    data: null,
  });

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, 'explore_transaccion'),
      where('userId', '==', userId),
      limit(1), // Limitar a un solo resultado, el más reciente
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        setPaymentData({
          exists: data.state === true,
          data: data,
        });
      } else {
        setPaymentData({
          exists: false,
          data: null,
        });
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return paymentData;
};

export default useVerifyPayment;
