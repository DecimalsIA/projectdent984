import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, updateDocument } from '../../../utils/firebase';
import { UserDocument } from '../../../types/user';
import { generateAuthToken } from '@/utils/auth';


const DB = process.env.NEXT_PUBLIC_FIREBASE_USER_COLLETION || 'USERS';

export async function POST(req: NextRequest) {
  const { idUser, publicKey } = await req.json();
  const idsession = generateAuthToken({ publicKey })

  if (!idUser || !publicKey) {
    return NextResponse.json({ message: 'Missing idUser or publicKey' }, { status: 400 });
  }
  console.log('idUser', idUser)
  // Check if the user exists
  const existingUsers = await getDocuments(DB, 'idUser', idUser) as UserDocument[];
  console.log('existingUsers', existingUsers)

  if (existingUsers.length === 0) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const currentUser = existingUsers[0];

  if (currentUser.idWallet && currentUser.idWallet !== publicKey) {
    return NextResponse.json({
      message: 'Wallet already registered with a different key',
      id: currentUser.id,
      idWallet: currentUser.idWallet,
      lastActivity: currentUser.lastActivity,
      idsession
    });
  }

  const updateData = {
    idWallet: publicKey,
    status: true,
    idsession,
    lastActivity: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    timestamp: Math.floor(Date.now() / 1000), // Unix timestamp in seconds,

  };

  try {
    if (currentUser.id) {
      await updateDocument(DB, currentUser.id, updateData);
    } else {
      throw new Error('Invalid user ID');
    }
    return NextResponse.json({
      message: 'Session updated',
      id: currentUser.id,
      idWallet: publicKey,
      lastActivity: updateData.lastActivity,

    });
  } catch (error) {
    console.error('Error updating document: ', error);
    return NextResponse.json({ message: 'Error updating session data' }, { status: 500 });
  }
}
