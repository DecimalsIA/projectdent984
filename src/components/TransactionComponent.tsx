/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import type { Commitment, RpcResponseAndContext, SignatureResult } from '@solana/web3.js';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import usePhantomDeeplink from '../hooks/usePhantomDeeplink';
import { getDappKeyPair, getDocumentByUserId } from '@/utils/getDocumentByUserId';
import { ButtonPambii } from 'pambii-devtrader-front';
import Image from 'next/image';

// ---------------------------------------------------------
// Función para construir una transacción de transferencia SPL
// ---------------------------------------------------------
async function buildTransferTransaction(
  senderPublicKey: PublicKey,
  tokenMintAddress: PublicKey,
  destinationPublicKey: PublicKey,
  amountInMinimalUnits: number,
  connection: Connection
): Promise<string> {
  // Obtener el blockhash reciente
  const { blockhash } = await connection.getLatestBlockhash();

  // Crear una nueva transacción
  const transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: senderPublicKey,
  });

  // Obtener la ATA del remitente
  const fromTokenAccount = await getAssociatedTokenAddress(
    tokenMintAddress,
    senderPublicKey
  );

  // Obtener la ATA del destinatario
  const toTokenAccount = await getAssociatedTokenAddress(
    tokenMintAddress,
    destinationPublicKey,
    true
  );

  // Crear la instrucción de transferencia
  const transferIx = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    senderPublicKey,
    amountInMinimalUnits,
    [],
    TOKEN_PROGRAM_ID
  );

  // Añadir la instrucción a la transacción
  transaction.add(transferIx);

  // Serializar la transacción a base64
  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });

  return Buffer.from(serializedTransaction).toString('base64');
}

// ---------------------------------------------------------
// Función para confirmar la transacción en la blockchain
// ---------------------------------------------------------
async function confirmTransactionOnChain(
  signature: string,
  connection: Connection
): Promise<void> {
  try {
    const commitment: Commitment = 'confirmed';
    const result: RpcResponseAndContext<SignatureResult> =
      await connection.confirmTransaction(signature, commitment);

    if (result.value.err) {
      throw new Error('La transacción falló.');
    } else {
      console.log('Transacción confirmada con éxito:', signature);
    }
  } catch (error) {
    console.error('Error confirmando la transacción en la blockchain:', error);
    throw error;
  }
}

interface TransactionComponentProps {
  spl: number;         // Cantidad de SPL tokens que se desea enviar
  userid: string;
  textButton?: string;
  fromTrn: string;
  bee?: any;
  map?: any;
  idBuy?: any;
  iconName?: any;
  onClicker?: () => void;
}

const TransactionComponent: React.FC<TransactionComponentProps> = ({
  spl,
  userid,
  textButton,
  fromTrn,
  bee,
  map,
  idBuy,
  iconName,
  onClicker,
}) => {
  const { deeplink, generateDeeplink } = usePhantomDeeplink();
  const [transaction, setTransaction] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dirección destino (wallet) donde se envían los tokens
  const DESTINATION_ADDRESS = 'DALASbVfzSWnvQ2jmXanU5C3cWPBvM25xmmnBZar72pj';

  // -----------------------------
  // 1. Crear transacción SPL cada vez que cambie spl o userid
  // -----------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const createTransaction = async () => {
      try {
        const connection = new Connection(
          'https://still-ultra-dew.solana-mainnet.quiknode.pro/9d166b50908d4c8ff8b3e715dd91b183ee4a8e2a',
          'confirmed'
        );

        const tokenMintAddress = new PublicKey('3TdsyqMn2sCqxEFf9B8hATCrMEW1Xh2thUTs7fpr2Rur');
        const destinationPublicKey = new PublicKey(DESTINATION_ADDRESS);

        const { publicKey: publicKeyString } = await getDocumentByUserId(userid);
        if (!publicKeyString) {
          console.error('No se encontró la clave pública del usuario:', userid);
          return;
        }

        const senderPublicKey = new PublicKey(publicKeyString);
        const decimals = 9;
        // Transforma la cantidad de tokens a su mínima unidad
        const amountInMinimalUnits = Math.floor(spl * 10 ** decimals);

        const serializedTransaction = await buildTransferTransaction(
          senderPublicKey,
          tokenMintAddress,
          destinationPublicKey,
          amountInMinimalUnits,
          connection
        );

        setTransaction(serializedTransaction);
      } catch (error) {
        console.error('Error al crear la transacción:', error);
      }
    };

    createTransaction();
  }, [spl, userid]);

  // -----------------------------
  // 2. Generar deeplink Phantom cada vez que haya una transacción nueva
  // -----------------------------
  useEffect(() => {
    if (!transaction || typeof window === 'undefined') return;

    const generateLink = async () => {
      try {
        const { session, sharedSecretDapp } = await getDocumentByUserId(userid);
        const { publicKey } = await getDappKeyPair(userid);

        // Construimos la URL a la que Phantom redirige tras la firma
        const redirectLink = `https://www.pambi.io/api/phantom-redirect-sign?userId=${userid}&fromTrn=${fromTrn}${
          bee ? `&bee=${bee}` : ''
        }${map ? `&map=${map}` : ''}${idBuy ? `&idBuy=${idBuy}` : ''}`;

        generateDeeplink({
          transaction,
          session,
          redirectLink,
          dappEncryptionPublicKey: publicKey,
          sharedSecret: sharedSecretDapp,
        });
      } catch (error) {
        console.error('Error al generar el deeplink:', error);
      }
    };

    generateLink();
  }, [transaction, userid, fromTrn, bee, map, idBuy, generateDeeplink]);

  // -----------------------------
  // 3. Leer signature de la URL y confirmar transacción
  // -----------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const sig = urlParams.get('signature');
    if (sig) {
      setSignature(sig);
    }
  }, []);

  // Confirmamos la transacción en on-chain si encontramos la firma en la URL
  useEffect(() => {
    if (!signature) return;

    const verifyPayment = async () => {
      try {
        const connection = new Connection(
          'https://still-ultra-dew.solana-mainnet.quiknode.pro/9d166b50908d4c8ff8b3e715dd91b183ee4a8e2a',
          'confirmed'
        );

        await confirmTransactionOnChain(signature, connection);
        console.log('Pago verificado en la blockchain.');
      } catch (err) {
        console.error('Error al verificar el pago:', err);
        setErrorMessage('No se pagaron los tokens o la transacción falló.');
      }
    };

    verifyPayment();
  }, [signature]);

  return (
    <div className="w-full">
      {deeplink && textButton && (
        <a href={deeplink} target="_blank" rel="noopener noreferrer">
          <ButtonPambii color="white" className="mb-2" onClick={onClicker}>
            {textButton} {spl && `${spl} PAMBI`}
          </ButtonPambii>
        </a>
      )}
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '0.5rem' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default TransactionComponent;