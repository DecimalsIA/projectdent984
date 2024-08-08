// app/api/phantom-redirect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');
  const publicKey = searchParams.get('public_key');

  if (session && publicKey) {
    try {
      // Guardar la información en Firestore
      await addDoc(collection(db, 'phantomConnections'), {
        session,
        publicKey,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({ message: 'Connection to Phantom Wallet successful!', session, publicKey });
    } catch (error: any) {
      return NextResponse.json({ message: 'Failed to save data', error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
  }
}
