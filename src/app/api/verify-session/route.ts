import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '../../../utils/firebase';
import { base64Decode } from '../../../utils/base64Utils';

const DB = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLECTION || 'USERS';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ message: 'Missing token' }, { status: 400 });
    }

    console.log('Received token:', token);

    const decoded = base64Decode(token);
    if (typeof decoded !== 'object' || !('id' in decoded)) {
      return NextResponse.json({ message: 'Invalid token structure' }, { status: 400 });
    }

    const decodedJson = decoded as { id: string };
    console.log('Decoded token:', decodedJson);

    const userDoc = await getDocuments(DB, 'id', decodedJson.id);

    if (userDoc.length === 0) {
      return NextResponse.json({ message: 'Session not found', active: false, firstTime: true }, { status: 401 });
    }

    const user = userDoc[0] as { idWallet: string };

    if (!user.idWallet) {
      return NextResponse.json({ message: 'Wallet not connected', active: false, firstTime: false }, { status: 401 });
    }

    return NextResponse.json({ session: decodedJson, active: true, idWallet: user.idWallet }, { status: 200 });
  } catch (error) {
    console.log('Error during token verification:', error);

    if ((error as Error).name === 'TokenExpiredError') {
      return NextResponse.json({ message: 'Session expired', active: false, firstTime: false }, { status: 403 });
    }
    return NextResponse.json({ message: 'Invalid token', active: false, firstTime: false }, { status: 401 });
  }
}
