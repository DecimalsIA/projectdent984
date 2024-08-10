import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
const NETWORK = clusterApiUrl("devnet");
export const buyBee = async (phantomWalletPublicKey: PublicKey) => {
  const connection = new Connection(NETWORK);
  if (!phantomWalletPublicKey) throw new Error("missing public key from user");
  let transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: phantomWalletPublicKey,
      toPubkey: phantomWalletPublicKey,
      lamports: 100,
    })
  );
  transaction.feePayer = phantomWalletPublicKey;
  console.log("Getting recent blockhash");
  const anyTransaction: any = transaction;
  anyTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  return transaction;
};