import { NextResponse } from 'next/server';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { generateRandomBeePart } from '@/utils/beeGenerator';

export async function POST(request: Request) {
  const { namePart, userId, hash } = await request.json(); // Recibe userId y hash en la solicitud

  // Generar la nueva parte
  const newPart = generateRandomBeePart(namePart);

  // Agregar los campos hash y userId a la parte
  const partWithUserData = {
    ...newPart,
    userId: userId,
    hash: hash,
  };

  const inventoryRef = doc(db, 'inventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);
  let inventory = inventoryDoc.exists() ? inventoryDoc.data() : { parts: [] };

  // Agregar la nueva parte con los datos del usuario al inventario
  inventory.parts.push(partWithUserData);
  await setDoc(inventoryRef, inventory);

  return NextResponse.json({ part: partWithUserData });
}
