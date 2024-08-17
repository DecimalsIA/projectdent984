import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, limit, startAfter, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function GET(request: Request) {
  try {
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const typePart = searchParams.get('typePart'); // Parámetro opcional
    const typePartName = searchParams.get('part');
    const pageSize = parseInt(searchParams.get('pageSize') || '10'); // Tamaño de página, por defecto 10
    const lastVisibleId = searchParams.get('lastVisibleId'); // ID del último documento visible

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Consultar la colección `beeParts` filtrando por `userId`, `isForSale`, e `isAssigned`
    let partsQuery;
    const partsRef = collection(db, 'beeParts');

    if (typePart) {
      partsQuery = query(
        partsRef,
        where('userId', '==', userId),
        where('isForSale', '==', true),
        where('isAssigned', '==', false),
        where('typePart', '==', typePart),
        limit(pageSize)
      );
    } else if (typePartName) {
      partsQuery = query(
        partsRef,
        where('userId', '==', userId),
        where('isForSale', '==', true),
        where('isAssigned', '==', false),
        where('namePart', '==', typePartName),
        limit(pageSize)
      );
    } else {
      partsQuery = query(
        partsRef,
        where('userId', '==', userId),
        where('isForSale', '==', true),
        where('isAssigned', '==', false),
        limit(pageSize)
      );
    }

    // Si se proporciona `lastVisibleId`, añadir `startAfter` para la paginación
    if (lastVisibleId) {
      const lastVisibleDoc = await getDoc(doc(db, 'beeParts', lastVisibleId));
      if (lastVisibleDoc.exists()) {
        partsQuery = query(partsQuery, startAfter(lastVisibleDoc));
      }
    }

    const partsSnapshot = await getDocs(partsQuery);

    if (partsSnapshot.empty) {
      return NextResponse.json({ error: 'No parts found for the user' }, { status: 404 });
    }

    // Agrupar las partes por tipo y obtener el último documento visible para la paginación
    const partsByType: Record<string, any[]> = {};
    partsSnapshot.docs.forEach((partDoc) => {
      const partData = partDoc.data();
      const type = partData.typePart;

      if (!partsByType[type]) {
        partsByType[type] = [];
      }

      partsByType[type].push(partData);
    });

    // Obtener el ID del último documento para la paginación
    const lastVisible = partsSnapshot.docs[partsSnapshot.docs.length - 1];

    // Devolver las partes agrupadas por tipo y el ID del último documento
    return NextResponse.json({ partsByType, lastVisibleId: lastVisible.id }, { status: 200 });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
