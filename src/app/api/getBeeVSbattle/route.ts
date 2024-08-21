import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, doc, getDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config';

// Define un tipo para la estructura de las abejas
interface Bee {
  id: string;
  userId: string;
  partIds?: string[];
  type: string;
  title?: string;
  abilitiesData?: any; // Ajusta el tipo según tus necesidades
  powers?: any[]; // Ajusta el tipo según tus necesidades
  level?: number;
  current?: number;
  max?: number;
}

// Define un tipo para la estructura de una parte de abeja
interface BeePart {
  isForSale: boolean;
  slotId?: string;
}

export async function GET(request: Request) {
  try {
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const userIds = searchParams.getAll('userId');
    const idbees = searchParams.getAll('idbee');

    if (userIds.length === 0) {
      return NextResponse.json({ error: 'At least one userId is required' }, { status: 400 });
    }

    if (idbees.length > 0 && idbees.length !== userIds.length) {
      return NextResponse.json({ error: 'The number of userIds and idbees must match' }, { status: 400 });
    }

    const results = await Promise.all(
      userIds.map(async (userId, index) => {
        const idbee = idbees[index];
        let beesSnapshot: QueryDocumentSnapshot<DocumentData>[] = [];

        if (idbee) {
          // Consultar una abeja específica por su idbee
          const beeRef = doc(db, 'BEES', idbee);
          const beeDoc = await getDoc(beeRef);

          if (!beeDoc.exists() || (beeDoc.data() as Bee).userId !== userId) {
            return { error: 'Bee not found for the user' };
          }

          beesSnapshot = [beeDoc as QueryDocumentSnapshot<DocumentData>]; // Convertimos el documento en un array para seguir con la estructura existente
        } else {
          // Consultar todas las abejas asociadas al userId en la colección `BEES`
          const beesRef = collection(db, 'BEES');
          const beesQuery = query(beesRef, where('userId', '==', userId));
          const querySnapshot = await getDocs(beesQuery);

          beesSnapshot = querySnapshot.docs;

          if (beesSnapshot.length === 0) {
            return { error: 'No bees found for the user' };
          }
        }

        // Construir la estructura de respuesta con las abejas, partes y slots
        const beePromises = beesSnapshot.map(async (beeDoc: QueryDocumentSnapshot<DocumentData>, index: number) => {
          const bee = beeDoc.data() as Bee;
          const partIds = bee.partIds || [];

          // Consultar las partes asociadas a la abeja
          const partsPromises = partIds.map(async (partId: string) => {
            const partRef = doc(db, 'beeParts', partId);
            const partDoc = await getDoc(partRef);
            const partData = partDoc.exists() ? (partDoc.data() as BeePart) : null;

            if (partData && partData.isForSale) {
              // Si alguna parte está en venta, no incluir esta abeja
              return null;
            }

            if (partData && partData.slotId) {
              // Si la parte tiene un slotId, obtener el slot asociado
              const slotRef = doc(db, 'slots', partData.slotId);
              const slotDoc = await getDoc(slotRef);
              const slotData = slotDoc.exists() ? slotDoc.data() : null;

              // Agregar la información del slot a la parte
              return { ...partData, slot: slotData };
            }

            return partData;
          });

          const partsWithSlots = (await Promise.all(partsPromises)).filter(Boolean);

          // Si se filtraron todas las partes porque alguna estaba en venta, no incluir la abeja
          if (partsWithSlots.length !== partIds.length) {
            return null;
          }

          // Estructura solicitada para la abeja
          return {
            image: `/assets/bee-characters/${bee.type.toLowerCase()}.png`,
            title: bee.title ? bee.title.toUpperCase() : 'UNKNOWN',
            abilitiesData: bee.abilitiesData,
            power: bee.powers && bee.powers.length > 0 ? bee.powers : null,
            progress: {
              level: bee?.level || 1,
              current: bee?.current || 1,
              max: bee?.max || 100,
            },  // Progreso por defecto si no está definido
            index: index,
            type: bee.type.toLowerCase(),
            id: bee.id,
            parts: partsWithSlots  // Incluye las partes y sus slots asociados
          };
        });

        // Esperar a que todas las promesas de abejas se resuelvan
        const bees = (await Promise.all(beePromises)).filter(Boolean); // Filtrar las abejas que no deben incluirse

        // Si no quedan abejas después de filtrar, devolver un error
        if (bees.length === 0) {
          return { error: 'No eligible bees found' };
        }

        return bees;
      })
    );

    // Aplanar el array de resultados en un único objeto
    const flattenedResults = results.flat();

    // Devolver la estructura completa con las abejas, partes y slots en un array de objetos
    return NextResponse.json({ bees: flattenedResults }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bees:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
