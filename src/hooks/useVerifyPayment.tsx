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

    // Crear la consulta para obtener el pago más reciente
    const q = query(
      collection(db, 'explore_transaccion'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(1), // Solo queremos el más reciente
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();

        // Calcular la diferencia de tiempo con la propiedad 'timeLock'
        const now = Date.now();
        const timeLock =
          data.timeLock instanceof Date
            ? data.timeLock.getTime() // Si es un objeto Date
            : data.timeLock.toMillis(); // Si es un Firestore Timestamp

        const difference = timeLock - now;

        // Actualizar el estado del pago
        setPaymentData({
          exists: data.state === true,
          data: data,
        });

        // Si la diferencia de tiempo es negativa, puedes decidir qué hacer
        if (difference <= 0) {
          // Desuscribirse si la diferencia es negativa
          unsubscribe();
        }
      } else {
        setPaymentData({
          exists: false,
          data: null,
        });
      }
    });

    // Limpieza en caso de desmontaje del componente
    return () => unsubscribe();
  }, [userId]);

  return paymentData;
};

export default useVerifyPayment;
