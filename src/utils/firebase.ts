import { db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, runTransaction } from 'firebase/firestore';
const DB = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLETION || 'USERS';
/**
 * Creates a new document in the specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {object} data - The data to be added to the collection.
 * @returns {Promise<string>} - The ID of the newly created document.
 */
export const createDocument = async (collectionName: string, data: object): Promise<string> => {
  const collectionRef = collection(db, collectionName);
  const docRef = await addDoc(collectionRef, data);
  return docRef.id;
};

/**
 * Retrieves documents from the specified collection that match the given field and value.
 * @param {string} collectionName - The name of the collection.
 * @param {string} field - The field to query.
 * @param {any} value - The value to query for.
 * @returns {Promise<object[]>} - An array of documents that match the query.
 */
export const getDocuments = async (collectionName: string, field: string, value: any): Promise<object[]> => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where(field, '==', value));
  const querySnapshot = await getDocs(q);
  const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return documents;
};

/**
 * Updates a document in the specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document to update.
 * @param {object} data - The data to update in the document.
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName: string, docId: string, data: object): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
};

/**
 * Deletes a document from the specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document to delete.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

/**
 * Retrieves a document by its ID from the specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document to retrieve.
 * @returns {Promise<object | null>} - The document data or null if not found.
 */
export const getDocumentById = async (collectionName: string, docId: string): Promise<object | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

/**
 * Runs a transaction to create a user if it doesn't already exist.
 * @param {object} userData - The user data to be added.
 * @returns {Promise<{ id: string, alreadyExists: boolean }>} - The ID of the newly created user or the existing user ID.
 */
export const createUserIfNotExists = async (userData: any): Promise<{ id: string; alreadyExists: boolean }> => {
  const userRef = collection(db, DB);
  try {
    const result = await runTransaction(db, async (transaction) => {
      const q = query(userRef, where('idUser', '==', userData.idUser));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User already exists
        return { id: querySnapshot.docs[0].id, alreadyExists: true };
      }

      const newUserRef = doc(userRef);
      const userWithIds = { ...userData, id: newUserRef.id };
      transaction.set(newUserRef, userWithIds);
      return { id: newUserRef.id, alreadyExists: false };
    });

    return result;
  } catch (error) {
    console.error('Transaction failed: ', error);
    throw error;
  }
};
