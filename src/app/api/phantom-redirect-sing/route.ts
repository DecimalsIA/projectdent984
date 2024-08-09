import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phantomEncryptionPublicKey = searchParams.get('phantom_encryption_public_key');
  const nonce = searchParams.get('nonce');
  const payload = searchParams.get('payload');
  const userId = searchParams.get('userId'); // Suponiendo que pasas el userId en la URL para identificar al usuario

  if (!phantomEncryptionPublicKey || !nonce || !payload || !userId) {
    return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
  }

  try {
    // 1. Recuperar dappKeyPair desde Firebase
    const keyPairDocRef = doc(db, 'dappKeyPairs', userId);
    const docSnap = await getDoc(keyPairDocRef);

    if (!docSnap.exists()) {
      throw new Error('dappKeyPair not found');
    }

    const storedKeyPair = docSnap.data();
    const dappKeyPair = {
      publicKey: bs58.decode(storedKeyPair.publicKey),
      secretKey: bs58.decode(storedKeyPair.secretKey),
    };

    // 2. Descifrar el payload
    const sharedSecret = nacl.box.before(bs58.decode(phantomEncryptionPublicKey), dappKeyPair.secretKey);
    const decryptedPayload = nacl.box.open.after(
      bs58.decode(payload),
      bs58.decode(nonce),
      sharedSecret
    );

    if (!decryptedPayload) {
      throw new Error('Failed to decrypt payload');
    }

    const decodedPayload = JSON.parse(new TextDecoder().decode(decryptedPayload));
    return NextResponse.json({ message: 'Success', data: decodedPayload });

  } catch (error: any) {
    console.error('Error decrypting payload:', error);
    return NextResponse.json({ error: 'Failure to decrypt payload', message: error.message }, { status: 500 });
  }
}
