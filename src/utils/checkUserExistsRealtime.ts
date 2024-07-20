import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const checkUserExistsRealtime = (idUser: string, callback: (exists: boolean, id?: string) => void) => {
  const userRef = collection(db, 'USERS');
  const q = query(userRef, where('idUser', '==', idUser));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (!querySnapshot.empty) {
      callback(true, querySnapshot.docs[0].id);
    } else {
      callback(false);
    }
  });

  return unsubscribe; // Return the unsubscribe function to stop listening when needed
};
