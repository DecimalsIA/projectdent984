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

        // Verificar y manejar el valor de 'timeLock'
        let timeLock;
        if (data.timeLock instanceof Date) {
          timeLock = data.timeLock.getTime(); // Si es un objeto Date
        } else if (
          data.timeLock &&
          typeof data.timeLock.toMillis === 'function'
        ) {
          timeLock = data.timeLock.toMillis(); // Si es un Firestore Timestamp
        } else {
          console.warn('timeLock no es ni Date ni Timestamp:', data.timeLock);
          timeLock = 0; // Si el campo no existe o es un formato no esperado, manejarlo
        }

        const now = Date.now();
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
