import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getDocumentByUserId } from "../getDocumentByUserId";

const NETWORK = clusterApiUrl("devnet");

export interface TransferParams {
  fromPubkey?: PublicKey;
  toPubkey: PublicKey;
  lamports: number;
  userId: string
}

export const createTransferTransaction = async (params: TransferParams) => {
  const { toPubkey, lamports, userId } = params;
  const connection = new Connection(NETWORK);
  const {
    publicKey: fromPublicKeyString,
  } = await getDocumentByUserId(userId);
  const fromPubkey = params.fromPubkey ? params.fromPubkey : new PublicKey(fromPublicKeyString);
  if (!fromPubkey) throw new Error("missing public key from user");

  let transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  transaction.feePayer = fromPubkey;
  console.log("Getting recent blockhash");

  const anyTransaction: any = transaction;
  anyTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  return transaction;
};
