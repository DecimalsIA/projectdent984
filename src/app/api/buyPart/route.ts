import { NextResponse } from 'next/server';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { generateRandomBeePart } from '@/utils/beeGenerator';


export async function POST(request: Request) {
  const { namePart, userId, hash } = await request.json();

  const inventoryRef = doc(db, 'inventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);

  if (!inventoryDoc.exists()) {
    return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
  }

  let inventory = inventoryDoc.data();

  // Verificar si el usuario tiene un slot disponible
  const availableSlot = inventory.slots.find((slot: { isFull: any; }) => !slot.isFull);

  if (!availableSlot) {
    return NextResponse.json({ error: 'No available slots. Purchase more slots to store parts.' }, { status: 400 });
  }

  // Generar la nueva parte
  const newPart = generateRandomBeePart(namePart);
  const partWithUserData = {
    ...newPart,
    userId: userId,
    hash: hash,
  };

  // Agregar la nueva parte al slot disponible
  availableSlot.parts.push(partWithUserData);

  // Verificar si el slot está lleno después de agregar la parte
  if (availableSlot.parts.length >= 6) {
    availableSlot.isFull = true;
  }

  // Guardar el inventario actualizado
  await setDoc(inventoryRef, inventory);

  return NextResponse.json({ part: partWithUserData });
}
