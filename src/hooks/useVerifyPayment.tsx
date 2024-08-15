import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
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
      orderBy('timestamp', 'desc'),
      limit(1),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        // Calcular la diferencia de tiempo
        const now = Date.now();
        const difference = data.timeLock - now;

        // Si la diferencia es negativa, desuscribirse
        if (difference <= 0) {
          unsubscribe(); // Desuscribirse cuando la diferencia sea negativa
        }

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

    // Limpieza opcional en caso de desmontaje del componente
    return () => unsubscribe();
  }, [userId]);

  return paymentData;
};

export default useVerifyPayment;
