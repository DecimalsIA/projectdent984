import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export async function POST(request: Request) {
  const { userId, partId, salePrice } = await request.json();

  const inventoryRef = doc(db, 'inventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);

  if (!inventoryDoc.exists()) {
    return NextResponse.json({ error: 'Inventory not found' }, { status: 404 });
  }

  let inventory = inventoryDoc.data();

  const partIndex = inventory.parts.findIndex((part: { idPart: any; isAssigned: any; }) => part.idPart === partId && !part.isAssigned);

  if (partIndex === -1) {
    return NextResponse.json({ error: 'Part not found or is not free' }, { status: 400 });
  }

  inventory.parts[partIndex].isForSale = true;
  inventory.parts[partIndex].salePrice = salePrice;

  await setDoc(inventoryRef, inventory);

  return NextResponse.json({ success: true, part: inventory.parts[partIndex] });
}
