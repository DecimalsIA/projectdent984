import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebase/config';

export interface Slot {
  id: string;
  partIds: string[];
  isFull: boolean;
  userId: string;
  createAt: number;
  updateAt: number;
}

export async function POST(request: Request) {
  try {
    // Manejar el análisis del cuerpo de la solicitud JSON
    let data;
    try {
      data = await request.json();
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      return NextResponse.json({ error: 'Invalid JSON input' }, { status: 400 });
    }

    const { userId } = data;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const slotId = uuidv4();

    // Crear el slot vacío
    const slot: Slot = {
      id: slotId,
      userId: userId,
      partIds: [],  // No hay partes asociadas en este slot
      isFull: false,  // El slot está vacío, por lo tanto, no está lleno
      createAt: new Date().getTime(),
      updateAt: new Date().getTime()
    };

    // Guardar el slot en Firestore en la colección `slots`
    await setDoc(doc(db, 'slots', slotId), slot);

    // Consultar el documento del usuario donde el campo `idUser` coincida con `userId`
    const usersRef = collection(db, 'USERS');
    const q = query(usersRef, where('idUser', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encontró el usuario, actualizar sus datos
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        slotIds: arrayUnion(slotId)
      });
      console.log('Slot created successfully.');
      return NextResponse.json({ slot }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
