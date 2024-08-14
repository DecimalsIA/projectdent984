import { NextResponse } from 'next/server';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomBeePart } from '@/utils/beeGenerator';

export async function POST(request: Request) {
  const { userId } = await request.json();
  const partNames = ['head', 'torso', 'stinger', 'hindLegs', 'frontLegs', 'wings'];

  const inventoryRef = doc(db, 'inventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);
  let inventory = inventoryDoc.exists() ? inventoryDoc.data() : { parts: [] };

  const partsPromises = partNames.map(async (namePart) => {
    const newPart = generateRandomBeePart(namePart);
    newPart.isAssigned = true; // Asignar la parte a una abeja
    inventory.parts.push(newPart); // Agregar la parte al inventario
    return newPart.idPart; // Retornar el ID de la parte
  });

  const partIds = await Promise.all(partsPromises);

  const bee = {
    id: uuidv4(),
    userId: userId,
    state: true,
    partIds, // IDs de las partes generadas
    type: 'Water' // Inicializar con un tipo predeterminado, que luego se recalculará
  };

  await setDoc(doc(db, 'beeSlot', bee.id), bee);
  await setDoc(inventoryRef, inventory); // Guardar el inventario actualizado

  return NextResponse.json({ bee });
}
