// utils/matchmaking.ts
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export async function findMatch({ idUser, arena }: { idUser: string; arena: string }) {
  const db = getFirestore();

  // Buscar una coincidencia en Firestore por arena y estado 'waiting'
  const q = query(
    collection(db, 'matchmaking'),
    where('arena', '==', arena),
    where('status', '==', 'waiting')
  );

  const matches = await getDocs(q);

  if (!matches.empty) {
    // Si se encuentra una coincidencia
    const matchDoc = matches.docs[0]; // Obtener el primer match encontrado
    const matchData = matchDoc.data();

    // Actualizar el estado del match a 'matched'
    await updateDoc(doc(db, 'matchmaking', matchDoc.id), {
      status: 'matched',
      matchedUserId: idUser, // Guardar el ID del usuario que coincidió
      matchedAt: new Date(),
    });

    return {
      matchId: matchDoc.id,
      status: 'matched',
      idUser1: matchData.idUser, // Usuario original en espera
      idUser2: idUser, // Usuario que coincidió
      arena: matchData.arena,
    };
  } else {
    // Si no hay coincidencia, regresar un estado de espera
    return {
      status: 'waiting',
    };
  }
}

export async function updateMatchStatus(matchId: string, status: string) {
  const db = getFirestore();
  await updateDoc(doc(db, 'matchmaking', matchId), { status });
}
