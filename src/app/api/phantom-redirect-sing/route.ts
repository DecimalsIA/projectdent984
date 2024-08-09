import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Transaction } from '@solana/web3.js'; // Asegúrate de que este paquete esté instalado y correctamente importado

function decryptPayload(data: string, nonce: string, sharedSecret: Uint8Array) {
  const dataBytes = bs58.decode(data);
  const nonceBytes = bs58.decode(nonce);
  const decrypted = nacl.box.open.after(dataBytes, nonceBytes, sharedSecret);

  if (!decrypted) {
    throw new Error('Failed to decrypt payload');
  }

  return JSON.parse(new TextDecoder().decode(decrypted));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nonce = searchParams.get('nonce');
  const payload = searchParams.get('data');
  const userId = searchParams.get('userId'); // Suponiendo que pasas el userId en la URL para identificar al usuario

  if (!nonce || !payload || !userId) {
    return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
  }

  try {
    // 1. Crear una consulta para buscar el documento donde userId coincide
    const phantomConnectionsRef = collection(db, 'phantomConnections');
    const q = query(phantomConnectionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Shared secret not found');
    }

    // Suponiendo que solo hay un documento que coincide
    const sharedKeyDocSnap = querySnapshot.docs[0].data();

    // Debug: Verificar el contenido del documento
    console.log('Document data:', sharedKeyDocSnap);

    const sharedSecretData = sharedKeyDocSnap.sharedSecretDapp;

    if (!sharedSecretData) {
      throw new Error('Shared secret field not found');
    }

    const sharedSecret = bs58.decode(sharedSecretData);

    // 2. Usar la función decryptPayload con el sharedSecret existente
    const decodedPayload = decryptPayload(payload, nonce, sharedSecret);

    // 3. Extraer y decodificar el campo 'transaction'
    const decodedTransaction = Transaction.from(bs58.decode(decodedPayload.transaction));

    return NextResponse.json({ message: 'Success', data: decodedTransaction });

  } catch (error: any) {
    console.error('Error decrypting payload:', error);
    return NextResponse.json({ error: 'Failure to decrypt payload', message: error.message }, { status: 500 });
  }
}
