import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { io as ClientIO } from 'socket.io-client';

export async function POST(req: NextRequest) {
  try {
    const { idUser, arena } = await req.json();

    if (!idUser || !arena) {
      return NextResponse.json({ success: false, message: 'Faltan datos en la solicitud' });
    }

    console.log(`Registrando solicitud de matchmaking: idUser=${idUser}, arena=${arena}`);

    // Registrar la solicitud en Firestore (estado inicial en waiting)
    const docRef = await addDoc(collection(db, 'matchmaking'), {
      idUser,
      arena,
      status: 'waiting',
      createdAt: serverTimestamp(),
    });

    console.log(`Solicitud registrada con éxito: ${docRef.id}`);

    // Conectar al servidor de Socket.IO como cliente y emitir el evento
    const socket = ClientIO('http://localhost:3000'); // Conéctate al servidor Express

    socket.emit('find-match', { idUser, arena });
    console.log(`Evento 'find-match' emitido para idUser=${idUser}, arena=${arena}`);

    // Cerrar la conexión después de emitir el evento
    socket.disconnect();

    return NextResponse.json({ success: true, message: 'Matchmaking request sent successfully', transactionId: docRef.id });
  } catch (error: any) {
    console.error('Error al registrar la solicitud de matchmaking:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
