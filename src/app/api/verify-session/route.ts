import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '../../../utils/firebase';
import { base64Decode } from '../../../utils/base64Utils';

const DB = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLECTION || 'USERS';

export async function POST(req: NextRequest) {
  try {
    const { token, idWallet } = await req.json();

    if (!token) {
      return NextResponse.json({ message: 'Missing token' }, { status: 400 });
    }

    if (!idWallet) {
      return NextResponse.json({ message: 'Missing wallet connect to Phantom wallet' }, { status: 400 });
    }

    console.log('Received token:', token);
    console.log('Received wallet:', idWallet);

    const decoded = base64Decode(token);
    console.log('Decoded token:', decoded);

    if (typeof decoded !== 'object' || !('id' in decoded)) {
      return NextResponse.json({ message: 'Invalid token structure' }, { status: 400 });
    }

    const decodedJson = decoded as { id: string };
    const userDoc = await getDocuments(DB, 'id', decodedJson.id);

    if (userDoc.length === 0) {
      return NextResponse.json({ message: 'Session not found', active: false, firstTime: true }, { status: 401 });
    }

    const user = userDoc[0] as { idWallet: string };

    if (!user.idWallet) {
      return NextResponse.json({ message: 'Wallet not connected', active: false, firstTime: false }, { status: 401 });
    }

    if (user.idWallet !== idWallet) {
      return NextResponse.json({ message: 'Wallet does not match', active: false, firstTime: false }, { status: 401 });
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
