import { NextRequest, NextResponse } from 'next/server';
import { collection, getDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config'; // Asegúrate de que esta ruta sea correcta
import nacl from 'tweetnacl';
import bs58 from 'bs58';

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
  const session = searchParams.get('session');
  const publicKey = searchParams.get('public_key');
  const phantomEncryptionPublicKey = searchParams.get('phantom_encryption_public_key');
  const data = searchParams.get('data');
  const nonce = searchParams.get('nonce');

  if (!session || !publicKey || !phantomEncryptionPublicKey || !data || !nonce) {
    return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
  }

  try {
    // Recuperar dappKeyPair desde Firestore
    const keyPairDocRef = doc(collection(db, 'dappKeyPairs'), 'defaultKeyPair');
    const docSnap = await getDoc(keyPairDocRef);

    if (!docSnap.exists()) {
      throw new Error('dappKeyPair not found');
    }

    const storedKeyPair = docSnap.data();
    const dappKeyPair = {
      publicKey: bs58.decode(storedKeyPair.publicKey),
      secretKey: bs58.decode(storedKeyPair.secretKey),
    };

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(phantomEncryptionPublicKey),
      dappKeyPair.secretKey
    );

    const connectData = decryptPayload(data, nonce, sharedSecretDapp);

    // Guarda la información en Firestore
    await addDoc(collection(db, 'phantomConnections'), {
      session: connectData.session,
      publicKey: connectData.public_key,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ message: 'Connection to Phantom Wallet successful!', session: connectData.session, publicKey: connectData.public_key });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to save data', error: error.message }, { status: 500 });
  }
}
