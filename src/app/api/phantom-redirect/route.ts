import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
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

  const phantomEncryptionPublicKey = searchParams.get('phantom_encryption_public_key');
  const data = searchParams.get('data');
  const nonce = searchParams.get('nonce');
  const userId = searchParams.get('userId');
  const walletAddress = searchParams.get('walletAddress'); // Capturar la dirección de la billetera

  if (!phantomEncryptionPublicKey || !data || !nonce || !userId || !walletAddress) {
    return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
  }

  try {
    // Recuperar dappKeyPair del usuario desde Firestore
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

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(phantomEncryptionPublicKey),
      dappKeyPair.secretKey
    );

    const connectData = decryptPayload(data, nonce, sharedSecretDapp);

    // Verificar si el userId ya existe en la colección 'phantomConnections'
    const connectionsQuery = query(collection(db, 'phantomConnections'), where('userId', '==', userId));
    const querySnapshot = await getDocs(connectionsQuery);
    console.log('querySnapshot.docs', querySnapshot.docs)

    if (!querySnapshot.empty) {
      // Si el userId ya existe, actualizar el documento
      const connectionDoc = querySnapshot.docs[0]; // Asumiendo que solo habrá un documento por userId
      await updateDoc(connectionDoc.ref, {
        session: connectData.session,
        updateAt: new Date().toISOString(),
        walletAddress: walletAddress, // Actualizar la dirección de la billetera conectada si es necesario

      });

      return NextResponse.json({ message: 'Connection to Phantom Wallet updated successfully!', session: connectData.session, publicKey: connectData.public_key });
    } else {
      // Si el userId no existe, crear un nuevo documento
      await addDoc(collection(db, 'phantomConnections'), {
        session: connectData.session,
        publicKey: connectData.public_key,
        walletAddress: walletAddress, // Guardar la dirección de la billetera conectada
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        userId, // Asociar la conexión al usuario
      });

      return NextResponse.json({ message: 'Connection to Phantom Wallet successful!', session: connectData.session, publicKey: connectData.public_key });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to save data', error: error.message }, { status: 500 });
  }
}
