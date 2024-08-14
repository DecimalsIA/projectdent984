import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Bee, BeePiece, collectPowers, determineBeeType } from './beeGenerator';

export const swapBeeParts = async (beeId: string, newPartIds: string[], userId: string): Promise<Bee | null> => {
  const beeRef = doc(db, 'beeSlot', beeId);
  const beeDoc = await getDoc(beeRef);

  if (!beeDoc.exists()) {
    return null;
  }

  const bee = beeDoc.data() as Bee;

  const inventoryRef = doc(db, 'inventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);
  if (!inventoryDoc.exists()) {
    throw new Error(`Inventory for user ${userId} not found`);
  }

  let inventory = inventoryDoc.data();

  const newParts = inventory.parts.filter((part: BeePiece) => newPartIds.includes(part.idPart) && !part.isForSale);

  if (newParts.length !== newPartIds.length) {
    throw new Error('Some parts are in sale and cannot be used');
  }

  const partNames = new Set(newParts.map((part: { namePart: any; }) => part.namePart));
  if (partNames.size !== newParts.length) {
    throw new Error('Duplicate parts are not allowed');
  }

  inventory.parts = inventory.parts.map((part: BeePiece) => {
    if (bee.partIds.includes(part.idPart)) {
      part.isAssigned = false;
    }
    return part;
  });

  inventory.parts = inventory.parts.map((part: BeePiece) => {
    if (newPartIds.includes(part.idPart)) {
      part.isAssigned = true;
    }
    return part;
  });

  bee.partIds = newPartIds;

  const powers = collectPowers(newParts);
  const type = determineBeeType(powers);

  bee.type = type;

  await setDoc(beeRef, bee);
  await setDoc(inventoryRef, inventory);

  return bee;
};
