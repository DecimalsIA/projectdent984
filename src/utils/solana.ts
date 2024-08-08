import { PublicKey, Transaction, TransactionInstruction, Connection, clusterApiUrl } from '@solana/web3.js';
import BN from 'bn.js';

const connection = new Connection(clusterApiUrl('devnet'));

export const createDeeplink = async (
  programId: string,
  baseAccount: string,
  user: string,
  newValue: number,
  dappPublicKey: string,
  appUrl: string,
  redirectUrl: string
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

  const serializedTransaction = transaction.serialize();
  const base64Transaction = serializedTransaction.toString('base64');

  const deeplink = `https://phantom.app/ul/v1/transaction?dapp_encryption_public_key=${dappPublicKey}&cluster=devnet&app_url=${appUrl}&redirect_url=${redirectUrl}&transaction=${base64Transaction}`;

  return deeplink;
};
