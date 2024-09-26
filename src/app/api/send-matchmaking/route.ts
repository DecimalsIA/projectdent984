import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { io as ClientIO } from 'socket.io-client';
const WS = process.env.NEXT_PUBLIC_WS_URL;
export async function POST(req: NextRequest) {
  try {
    const { idUser, arena, bee } = await req.json();

    if (!idUser || !arena || !bee) {
      return NextResponse.json({ success: false, message: 'Faltan datos en la solicitud' });
    }

    console.log(`Registrando solicitud de matchmaking: idUser=${idUser}, arena=${arena}, bee=${bee}`);

    // Registrar la solicitud en Firestore (estado inicial en waiting)
    const docRef = await addDoc(collection(db, 'matchmaking'), {
      idUser,
      arena,
      bee,
      status: 'waiting',
      createdAt: serverTimestamp(),
    });

    console.log(`Solicitud registrada con éxito: ${docRef.id}`);

    // Conectar al servidor de Socket.IO como cliente y emitir el evento
    if (!WS) {
      throw new Error('WebSocket URL is not defined');
    }
    const socket = ClientIO(WS); // Conéctate al servidor Express

    socket.emit('find-match', { idUser, arena, bee });
    console.log(`Evento 'find-match' emitido para idUser=${idUser}, arena=${arena}`);

    // Cerrar la conexión después de emitir el evento
    // socket.disconnect();

    return NextResponse.json({ success: true, message: 'Matchmaking request sent successfully', transactionId: docRef.id });
  } catch (error: any) {
    console.error('Error al registrar la solicitud de matchmaking:', error);

    return NextResponse.json({ success: false, error: error.message });
  }
}
