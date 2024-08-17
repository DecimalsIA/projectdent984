import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

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

    // Definir la colección desde donde se eliminarán los documentos
    const { collectionName } = data;
    if (!collectionName) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    // Consultar todos los documentos donde userId sea "System"
    const colRef = collection(db, collectionName);
    const q = query(colRef, where('userId', '==', 'System'));
    const querySnapshot = await getDocs(q);

    // Borrar cada documento que coincida con la consulta
    const deletePromises = querySnapshot.docs.map((document) =>
      deleteDoc(doc(db, collectionName, document.id))
    );

    await Promise.all(deletePromises);

    console.log('Documents with userId "System" deleted successfully.');
    return NextResponse.json({ message: 'Documents deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
