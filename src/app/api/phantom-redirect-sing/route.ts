import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import axios from 'axios';

function decryptPayload(data: string, nonce: string, sharedSecret: Uint8Array) {
  const dataBytes = bs58.decode(data);
  const nonceBytes = bs58.decode(nonce);
  const decrypted = nacl.box.open.after(dataBytes, nonceBytes, sharedSecret);

  if (!decrypted) {
    throw new Error('Failed to decrypt payload');
  }
  return JSON.parse(new TextDecoder().decode(decrypted));
}

async function getGeoData(ip: string) {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { country_name, region, city, latitude, longitude } = response.data;
    return {
      country: country_name || 'País no disponible',
      region: region || 'Región no disponible',
      city: city || 'Ciudad no disponible',
      latitude: latitude || null,
      longitude: longitude || null,
    };
  } catch (error) {
    console.error('Error al obtener la geolocalización:', error);
    return {
      country: 'País no disponible',
      region: 'Región no disponible',
      city: 'Ciudad no disponible',
      latitude: null,
      longitude: null,
    };
  }
}

const addDocumentGeneric = async (dtb: string, data: any) => {
  try {
    const geoData = await getGeoData(data.ip);
    const enrichedData = {
      ...data,
      geoData,  // Agregar geoData directamente a data
      createdAt: new Date().toISOString(),  // Agregar timestamp de creación
    };
    const beeDocRef = await addDoc(collection(db, dtb), enrichedData);
    await updateDoc(doc(db, dtb, beeDocRef.id), {
      id: beeDocRef.id,
      updateAt: new Date()

    });

    return beeDocRef.id;
  } catch (error: any) {
    console.error('Error al crear el documento:', error.message);
    throw new Error('No se pudo crear el documento');
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nonce = searchParams.get('nonce');
  const payload = searchParams.get('data');
  const fromTrn = searchParams.get('fromTrn');
  const userId = searchParams.get('userId');

  if (!nonce || !payload || !userId || !fromTrn) {
    return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const phantomConnectionsRef = collection(db, 'phantomConnections');
    const q = query(phantomConnectionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'IP no disponible';
    const userAgent = request.headers.get('user-agent') || 'User-Agent no disponible';
    const Host = request.headers.get('Host') || 'Host no disponible';

    if (querySnapshot.empty) {
      throw new Error('Shared secret not found');
    }

    const sharedKeyDocSnap = querySnapshot.docs[0].data();
    const sharedSecretData = sharedKeyDocSnap.sharedSecretDapp;

    if (!sharedSecretData) {
      throw new Error('Shared secret field not found');
    }

    const sharedSecret = bs58.decode(sharedSecretData);
    const decodedPayload = decryptPayload(payload, nonce, sharedSecret);

    if (decodedPayload.signature) {
      if (fromTrn === 'buyBee') {
        const data = {
          userId: userId,
          state: true,
          bee: '',
          hash: decodedPayload.signature,
          Host,
          ip,
          dispositivo: userAgent,
        };
        const dta = await addDocumentGeneric('BEES', data);
        console.log('buyBee', dta);
      }
      if (fromTrn === 'explore') {
        const data = {
          userId: userId,
          state: true,
          map: '',
          bee: '',
          reward: '',
          Host,
          hash: decodedPayload.signature,
          ip,
          dispositivo: userAgent,
        };
        const dta = await addDocumentGeneric('explore_transaccion', data);
        console.log('explore', dta);
      }
    }

    return NextResponse.redirect('https://t.me/PambiiGameBot');
  } catch (error: any) {
    console.error('Error decrypting payload:', error.message);
    return NextResponse.json({ error: 'Failure to decrypt payload', message: error.message }, { status: 500 });
  }
}
