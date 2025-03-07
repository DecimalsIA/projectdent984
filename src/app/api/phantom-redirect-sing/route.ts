import { NextRequest, NextResponse } from 'next/server';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, limit } from 'firebase/firestore';
import axios from 'axios';
import { createBeeParts } from '@/utils/generateRandomBeePart';
import { processGame } from '@/utils/gexplore';
const API = process.env.NEXT_PUBLIC_API_URL
const BOT = process.env.NEXT_PUBLIC_BOT_URL || "https://t.me/PambiiGameBot"


const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Página Renderizada</title>
    </head>
    <body>
      <h1>¡Hola, Ve a telegram!</h1>
    </body>
    </html>
  `;

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
      createdAt: new Date().getTime(),  // Agregar timestamp de creación
    };
    const beeDocRef = await addDoc(collection(db, dtb), enrichedData);
    await updateDoc(doc(db, dtb, beeDocRef.id), {
      id: beeDocRef.id,
      updateAt: new Date().getTime()

    });

    return beeDocRef.id;
  } catch (error: any) {
    console.error('Error al crear el documento:', error.message);
    throw new Error('No se pudo crear el documento');
  }
};
function addMinutesToTimestamp(minutes: number) {
  // 1 minuto = 60,000 milisegundos
  const millisecondsToAdd = minutes * 60 * 1000;
  return new Date().getTime() + millisecondsToAdd;
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nonce = searchParams.get('nonce');
  const payload = searchParams.get('data');
  const fromTrn = searchParams.get('fromTrn');
  const userId = searchParams.get('userId');
  const bee = searchParams.get('bee');
  const map = searchParams.get('map');

  if (!nonce || !payload || !userId) {
    return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const phantomConnectionsRef = collection(db, 'phantomConnections');
    const q = query(phantomConnectionsRef, where('userId', '==', userId), limit(1));
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
        const genBee = await createBeeParts(userId, decodedPayload.signature);
        console.log('genBee', genBee)

        if (genBee) {
          const data = {
            userId: userId,
            state: true,
            hash: decodedPayload.signature,
            Host,
            ip,
            dispositivo: userAgent,
          };

          await addDocumentGeneric('beee_transactions', data);
        }
        return NextResponse.redirect(BOT);
      }

      if (fromTrn === 'explore' && map) {
        const mapNumber = map === 'easy' ? 1 : bee === 'middle' ? 2 : 3;
        const valuePambii = map === 'easy' ? 10 : bee === 'middle' ? 20 : 35;
        const explorationPlay: any = await processGame(userId, mapNumber, valuePambii, decodedPayload.signature)
        if (explorationPlay) {
          const data = {
            userId: userId,
            state: true,
            map: map,
            bee: bee,
            reward: '',
            Host,
            hash: decodedPayload.signature,
            ip,
            dispositivo: userAgent,
            explorationPlay: explorationPlay,
            timeLock: addMinutesToTimestamp(map === 'easy' ? 5 : map === 'middle' ? 10 : 20),
            timestamp: serverTimestamp(),
          };
          const dta = await addDocumentGeneric('explore_transaccion', data);
          // console.log('explore', dta);

        }
        return NextResponse.redirect(BOT);
      }
      if (fromTrn === 'retiro') {
        return NextResponse.json({ sms: 'Failure to decrypt payload', hash: decodedPayload.signature }, { status: 200 });
      }
      if (fromTrn === 'buy_battle') {
        const data = {
          userId: userId,
          state: true,
          map: map,
          bee: bee,
          reward: '',
          Host,
          hash: decodedPayload.signature,
          ip,
          dispositivo: userAgent,
          Battlelay: 0,
          timeLock: addMinutesToTimestamp(map === 'easy' ? 5 : map === 'middle' ? 10 : 20),
          timestamp: serverTimestamp(),
        };
        await addDocumentGeneric('explore_transaccion', data);
        return NextResponse.redirect(BOT);
      }

      return new NextResponse(htmlContent, { headers: { 'Content-Type': 'text/html' }, });
    }


  } catch (error: any) {
    console.error('Error decrypting payload:', error.message);
    return NextResponse.json({ error: 'Failure to decrypt payload', message: error.message, API, BOT }, { status: 500 });
  }
}
