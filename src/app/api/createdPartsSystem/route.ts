import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { BeePiece, generateRandomBeePart } from '@/utils/beeGenerator';

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

    let { typesRequested = [] } = data;

    const validTypes = ['fire', 'water', 'earth', 'air', 'phantom', 'poison', 'metal', 'gem'];
    const partNames = ['head', 'torso', 'stinger', 'hindLegs', 'frontLegs', 'wings'];
    const createdParts: BeePiece[] = [];

    // Si `typesRequested` está vacío, generar partes para todos los tipos válidos
    if (typesRequested.length === 0) {
      typesRequested = validTypes;
    }

    // Validar y generar partes para cada tipo solicitado
    for (const requestedType of typesRequested) {
      if (!validTypes.includes(requestedType)) {
        return NextResponse.json({ error: `Invalid type name: ${requestedType}` }, { status: 400 });
      }

      // Generar 6 partes para cada tipo solicitado
      for (const partName of partNames) {
        const newPart = generateRandomBeePart(partName);
        newPart.idPart = uuidv4();
        newPart.isAssigned = false;
        newPart.isForSale = true;
        newPart.userId = 'System';
        newPart.typePart = requestedType; // Asignar el tipo específico a la parte
        createdParts.push(newPart);

        // Guardar la parte en Firestore
        await setDoc(doc(db, 'beeParts', newPart.idPart), newPart);
      }
    }

    console.log('Bee parts created successfully.');
    return NextResponse.json({ createdParts }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
  }
}
