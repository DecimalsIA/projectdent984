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

    const { numberOfParts = 1, partsRequested = [], userId } = data;

    const validPartNames = ['head', 'torso', 'stinger', 'hindLegs', 'frontLegs', 'wings'];
    const createdParts: BeePiece[] = [];

    // Si `partsRequested` tiene elementos, generar solo las partes solicitadas
    if (partsRequested.length > 0) {
      for (const requestedPart of partsRequested) {
        if (!validPartNames.includes(requestedPart)) {
          return NextResponse.json({ error: `Invalid part name: ${requestedPart}` }, { status: 400 });
        }

        const newPart = generateRandomBeePart(requestedPart);
        newPart.idPart = uuidv4();
        newPart.isAssigned = false;
        newPart.userId = userId;
        createdParts.push(newPart);

        // Guardar la parte en Firestore
        await setDoc(doc(db, 'beeParts', newPart.idPart), newPart);
      }
    }
    // Si `partsRequested` está vacío, generar partes aleatorias según `numberOfParts`
    else {
      for (let i = 0; i < numberOfParts; i++) {
        const randomPartName = validPartNames[Math.floor(Math.random() * validPartNames.length)];
        const newPart = generateRandomBeePart(randomPartName);
        newPart.idPart = uuidv4();
        newPart.isAssigned = false;
        newPart.userId = userId;
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
