import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Bee, BeePiece, collectPowers, determineBeeType } from './beeGenerator';

export const swapBeeParts = async (beeId: string, newPartIds: string[], userId: string): Promise<Bee | null> => {
  // Obtener la abeja desde Firestore
  const beeRef = doc(db, 'beeSlot', beeId);
  const beeDoc = await getDoc(beeRef);

  if (!beeDoc.exists()) {
    return null;
  }

  const bee = beeDoc.data() as Bee;

  // Obtener el inventario del usuario desde Firestore
  const inventoryRef = doc(db, 'inventory', userId);
  const inventoryDoc = await getDoc(inventoryRef);
  if (!inventoryDoc.exists()) {
    throw new Error(`Inventory for user ${userId} not found`);
  }

  let inventory = inventoryDoc.data();

  // Filtrar las nuevas partes del inventario basadas en los IDs proporcionados
  const newParts = inventory.parts.filter((part: BeePiece) => newPartIds.includes(part.idPart) && !part.isForSale);

  // Verificar que todas las nuevas partes estén disponibles y no estén en venta
  if (newParts.length !== newPartIds.length) {
    throw new Error('Some parts are in sale and cannot be used');
  }

  // Verificar que no haya piezas duplicadas (por ejemplo, dos cabezas)
  const partNames = new Set(newParts.map((part: { namePart: any; }) => part.namePart));
  if (partNames.size !== newParts.length) {
    throw new Error('Duplicate parts are not allowed');
  }

  // Actualizar el inventario: desasignar las partes viejas y asignar las nuevas
  inventory.parts = inventory.parts.map((part: BeePiece) => {
    if (bee.partIds.includes(part.idPart)) {
      part.isAssigned = false;  // Desasignar las partes viejas
    }
    if (newPartIds.includes(part.idPart)) {
      part.isAssigned = true;  // Asignar las nuevas partes
    }
    return part;
  });

  // Actualizar los IDs de las partes de la abeja
  bee.partIds = newPartIds;

  // Calcular los poderes y el nuevo tipo de la abeja basado en las nuevas partes
  const powers = collectPowers(newParts);
  const type = determineBeeType(powers);

  // Asignar el nuevo tipo a la abeja
  bee.type = type;

  // Guardar la abeja y el inventario actualizados en Firestore
  await setDoc(beeRef, bee);
  await setDoc(inventoryRef, inventory);

  return bee;
};
