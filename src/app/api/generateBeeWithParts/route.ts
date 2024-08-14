import { NextResponse } from 'next/server';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

import { v4 as uuidv4 } from 'uuid';
import { BeePiece, generateRandomBeePart } from '@/utils/beeGenerator';

export async function POST(request: Request) {
  const { userId } = await request.json();
  const partNames = ['head', 'torso', 'stinger', 'hindLegs', 'frontLegs', 'wings'];

  const inventoryRef = doc(db, 'inventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);
  let inventory = inventoryDoc.exists() ? inventoryDoc.data() : { slots: [] };

  // Crear un nuevo slot para la abeja y asegurar que el array parts esté tipado correctamente
  const newSlot: { id: string; parts: BeePiece[]; isFull: boolean } = {
    id: uuidv4(),
    parts: [],  // Aquí estamos tipando explícitamente el array como BeePiece[]
    isFull: false
  };

  // Generar las partes y agregarlas al nuevo slot
  const partsPromises = partNames.map(async (namePart) => {
    const newPart = generateRandomBeePart(namePart);
    newPart.isAssigned = true;
    newSlot.parts.push(newPart);  // Ya no deberíamos ver el error de tipo aquí
    return newPart.idPart;
  });

  const partIds = await Promise.all(partsPromises);

  const bee = {
    id: uuidv4(),
    userId: userId,
    partIds,
    type: 'Water'
  };

  inventory.slots.push(newSlot);

  await setDoc(doc(db, 'beeSlot', bee.id), bee);
  await setDoc(inventoryRef, inventory);

  return NextResponse.json({ bee });
}
