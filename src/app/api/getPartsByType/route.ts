import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function GET(request: Request) {
  try {
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const typePart = searchParams.get('typePart'); // Parámetro opcional
    const typePartName = searchParams.get('part');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Consultar el documento del usuario en la colección `USERS` usando `where`
    const usersRef = collection(db, 'USERS');
    const userQuery = query(usersRef, where('idUser', '==', userId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnapshot.docs[0].data(); // Obtener el primer documento (asumimos que hay uno)
    const slotIds = userData.slotIds || [];
    const beeIds = userData.beeIds || [];

    if (slotIds.length === 0 && beeIds.length === 0) {
      return NextResponse.json({ error: 'No bees or slots found for the user' }, { status: 404 });
    }

    // Consultar todos los slots para obtener los `partIds`
    const slotsPromises = slotIds.map(async (slotId: string) => {
      const slotRef = doc(db, 'slots', slotId);
      const slotDoc = await getDoc(slotRef);
      return slotDoc.exists() ? { slotId, partIds: slotDoc.data().partIds || [] } : null;
    });

    const slots = (await Promise.all(slotsPromises)).filter(Boolean); // Filtrar los resultados nulos
    const partIdsFromSlots = slots.flatMap(slot => slot.partIds); // Obtener todos los `partIds`

    if (partIdsFromSlots.length === 0) {
      return NextResponse.json({ error: 'No parts found in slots' }, { status: 404 });
    }

    // Consultar las abejas para obtener las partes asociadas a ellas
    const beesPromises = beeIds.map(async (beeId: string) => {
      const beeRef = doc(db, 'BEES', beeId);
      const beeDoc = await getDoc(beeRef);
      return beeDoc.exists() ? { beeId, partIds: beeDoc.data().partIds || [] } : null;
    });

    const bees = (await Promise.all(beesPromises)).filter(Boolean); // Filtrar los resultados nulos

    // Consultar las partes asociadas a los `partIds`
    let partsQuery;
    const partsRef = collection(db, 'beeParts');

    console.log('partsRef', partsRef)


    if (typePart) {
      // Si se proporciona `typePart`, filtrar por tipo de parte y `partIds`
      partsQuery = query(partsRef, where('idPart', 'in', partIdsFromSlots), where('typePart', '==', typePart));
    } else {
      if (typePartName) {
        partsQuery = query(partsRef, where('idPart', 'in', partIdsFromSlots), where('namePart', '==', typePartName));
      } else {
        // Si no se proporciona `typePart`, traer todas las partes asociadas a los `partIds`
        partsQuery = query(partsRef, where('idPart', 'in', partIdsFromSlots));

      }
    }


    const partsSnapshot = await getDocs(partsQuery);

    if (partsSnapshot.empty) {
      return NextResponse.json({ error: 'No parts found for the user' }, { status: 404 });
    }

    // Agrupar las partes por tipo y añadir el ID de la abeja y el slot
    const partsByType: Record<string, any[]> = {};
    const partsPromises = partsSnapshot.docs.map(async (partDoc) => {
      const partData = partDoc.data();
      const type = partData.typePart;

      // Inicializar el array para este tipo de parte si no existe
      if (!partsByType[type]) {
        partsByType[type] = [];
      }

      // Buscar a qué abeja pertenece la parte (si aplica)
      const beeData = bees.find(bee => bee.partIds.includes(partData.idPart));

      // Obtener el slot al que está asignada la parte
      const slotData = slots.find(slot => slot.partIds.includes(partData.idPart));

      // Agregar la parte al grupo correspondiente en partsByType, junto con los IDs de bee y slot
      partsByType[type].push({
        ...partData,
        beeId: beeData ? beeData.beeId : null,
        slotId: slotData ? slotData.slotId : null
      });
    });

    // Esperar a que todas las promesas de las partes se resuelvan
    await Promise.all(partsPromises);

    // Devolver las partes agrupadas por tipo con la información de la parte, el ID de la abeja y el slot
    return NextResponse.json({ partsByType }, { status: 200 });
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
