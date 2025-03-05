import { Connection, PublicKey, Transaction, TransactionInstruction, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';
import BN from 'bn.js';

const connection = new Connection(clusterApiUrl('mainnet'));

export const createTransaction = async (
  programId: string,
  baseAccount: string,
  user: string,
  newValue: number
): Promise<string> => {
  const programPublicKey = new PublicKey(programId);
  const baseAccountPublicKey = new PublicKey(baseAccount);
  const userPublicKey = new PublicKey(user);

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: baseAccountPublicKey, isSigner: false, isWritable: true },
      { pubkey: userPublicKey, isSigner: true, isWritable: false },
    ],
    programId: programPublicKey,
    data: Buffer.from(Uint8Array.of(1, ...new BN(newValue).toArray('le', 8))),
  });

  let transaction = new Transaction().add(instruction);
  transaction.feePayer = userPublicKey;
  transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

  return bs58.encode(transaction.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  }));
};
