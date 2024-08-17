import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { BeePiece, generateRandomBeePart } from '@/utils/beeGenerator';

export interface Slot {
  id: string;
  parts: BeePiece[];
  isFull: boolean;
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

    const { userId } = data;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const partNames = ['head', 'torso', 'stinger', 'hindLegs', 'frontLegs', 'wings'];
    console.log('Received userId:', userId);

    // Inicializar el inventario del usuario con el tipo explícito de los slots
    let inventory: { slots: Slot[] } = { slots: [] };

    console.log('Current inventory:', inventory);

    // Verificar si el último slot está lleno o no
    const lastSlot = inventory.slots[inventory.slots.length - 1];
    if (!lastSlot || lastSlot.isFull) {
      // Si no hay slots o el último slot está lleno, agregar un nuevo slot
      const newSlot: Slot = {
        id: uuidv4(),
        parts: [],
        isFull: false
      };
      inventory.slots.push(newSlot); // Agregar el nuevo slot
    }

    // Usar el último slot disponible para agregar las partes
    const availableSlot = inventory.slots[inventory.slots.length - 1];

    // Generar las partes y agregarlas al último slot disponible
    const partsPromises = partNames.map(async (namePart) => {
      const newPart = generateRandomBeePart(namePart);
      newPart.isAssigned = true;
      newPart.userId = userId;  // Marcar la parte como asignada
      availableSlot.parts.push(newPart);  // Agregar la parte al slot
      return newPart;  // Retornar el objeto completo
    });

    const parts = await Promise.all(partsPromises);

    // Verificar si el slot está lleno después de agregar las partes
    if (availableSlot.parts.length >= 6) {
      availableSlot.isFull = true;
    }

    console.log('Generated parts:', parts);

    // Obtener solo los IDs de las partes para crear la abeja
    const partIds = parts.map(part => part.idPart);

    // Determinar el tipo de la abeja basado en la mayoría de los tipos de las partes
    const typeCount: Record<string, number> = {};

    parts.forEach(part => {
      if (typeCount[part.typePart]) {
        typeCount[part.typePart]++;
      } else {
        typeCount[part.typePart] = 1;
      }
    });

    // Verificar si todas las partes son de tipos diferentes
    const uniqueTypes = Object.keys(typeCount).length;

    let majorityType = '';

    if (uniqueTypes === parts.length) {
      // Todas las partes son de tipos diferentes
      majorityType = 'All';
    } else {
      // Encontrar el tipo con más apariciones
      let maxCount = 0;
      for (const [type, count] of Object.entries(typeCount)) {
        if (count > maxCount) {
          maxCount = count;
          majorityType = type;
        }
      }
    }

    // Crear el objeto de la abeja
    const bee = {
      id: uuidv4(),
      userId,
      partIds,
      parts,    // Para devolver en la respuesta completa
      type: majorityType, // Tipo determinado por las partes o "All",
      slot: inventory.slots[0].id
    };

    console.log('Bee generated:', bee);
    console.log('Updated inventory:', inventory);

    // Devolver el inventario completo y la abeja generada
    return NextResponse.json({ bee, inventory });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
