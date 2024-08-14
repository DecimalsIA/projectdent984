import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const { userId } = await request.json();

  const inventoryRef = doc(db, 'inventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);

  if (!inventoryDoc.exists()) {
    return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
  }

  let inventory = inventoryDoc.data();

  // Crear un nuevo slot vacío
  const newSlot = {
    id: uuidv4(),
    parts: [],
    isFull: false
  };

  inventory.slots.push(newSlot);

  // Guardar el inventario actualizado
  await setDoc(inventoryRef, inventory);

  return NextResponse.json({ success: true, slot: newSlot });
}
