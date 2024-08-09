import { db } from "@/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getDocumentByUserId = async (
  userId: string
) => {
  try {
    const q = query(
      collection(db, 'phantomConnections'),
      where('userId', '==', userId),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data(); // Retorna el primer documento que coincide con el filtro
    } else {
      throw new Error('No document found for the given userId');
    }
  } catch (error) {
    console.error('Error getting document: ', error);
    throw error;
  }
};


export const getDappKeyPair = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'dappKeyPairs'),
      where('userId', '==', userId),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data(); // Retorna el primer documento que coincide con el filtro
    } else {
      throw new Error('No dappKeyPair found for the given userId');
    }
  } catch (error) {
    console.error('Error getting dappKeyPair: ', error);
    throw error;
  }
};