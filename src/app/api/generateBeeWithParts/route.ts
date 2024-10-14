import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, getDocs, updateDoc, collection, query, where, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { BeePiece, generateRandomBeePart, collectStats, groupAbilitiesByName } from '@/utils/beeGenerator';

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

    const { userId, hash } = data;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    if (!hash) {
      return NextResponse.json({ error: 'hash is required' }, { status: 400 });
    }

    const partNames = ['head', 'torso', 'stinger', 'hindLegs', 'frontLegs', 'wings'];
    const beeId = uuidv4();
    const slotId = uuidv4();
    const parts: BeePiece[] = [];
    const partIds: string[] = [];
    const ability = []

    // Generar las partes de la abeja
    for (const namePart of partNames) {
      const newPart = generateRandomBeePart(namePart);
      newPart.idPart = uuidv4();  // Generar un ID único para la parte
      newPart.isAssigned = true;  // Marcar la parte como asignada
      newPart.userId = userId;
      parts.push(newPart);
      partIds.push(newPart.idPart);
      ability.push(newPart.ability)
      // Guardar la parte en Firestore en la colección `beeParts`
      await setDoc(doc(db, 'beeParts', newPart.idPart), newPart);
    }

    // Calcular la suma de las estadísticas de todas las partes
    const totalStats = collectStats(parts);

    // Transformar totalStats en un array de objetos para el campo powers
    const powers = Object.keys(totalStats).map(statName => ({
      name: statName,
      value: totalStats[statName as keyof typeof totalStats],
    }));

    // Crear el slot y asignar las partes
    const slot: Slot = {
      id: slotId,
      userId: userId,
      partIds: partIds,
      isFull: partIds.length >= 6,
      createAt: new Date().getTime(),
      updateAt: new Date().getTime()
    };

    // Guardar el slot en Firestore en la colección `slots` //
    await setDoc(doc(db, 'slots', slotId), slot);

    // Determinar el tipo de la abeja basado en la mayoría de los tipos de las partes
    const typeCount: Record<string, number> = {};
    parts.forEach(part => {
      typeCount[part.typePart] = (typeCount[part.typePart] || 0) + 1;
    });

    const uniqueTypes = Object.keys(typeCount).length;
    let majorityType = uniqueTypes === parts.length ? 'All' : Object.keys(typeCount).reduce((a, b) => typeCount[a] > typeCount[b] ? a : b);

    // Crear la abeja
    const bee = {
      id: beeId,
      image: majorityType.toLowerCase(),
      title: 'BEE new ' + majorityType.toLowerCase(),
      userId,
      partIds,
      type: majorityType,
      powers, // Asignar totalStats en el campo powers
      habilities: [],
      abilitiesData: ability,
      state: true,
      createdAt: new Date().toISOString(),
      hashId: hash
    };

    // Guardar la abeja en Firestore en la colección `BEES`
    await setDoc(doc(db, 'BEES', beeId), bee);

    // Consultar el documento del usuario donde el campo `idUser` coincida con `userId`

    const usersRef = collection(db, 'USERS');
    const q = query(usersRef, where('idUser', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si se encontró el usuario, actualizar sus datos
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        beeIds: arrayUnion(beeId),
        slotIds: arrayUnion(slotId)
      });
      console.log('Bee, parts, and slot created successfully.');
      return NextResponse.json({ bee, parts, slot }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'An error occurred while processing your request. User not found' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
