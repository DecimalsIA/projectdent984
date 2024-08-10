/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import usePhantomDeeplink from '../hooks/usePhantomDeeplink';
import { buildTransaction } from '../utils/buildTransaction';

import {
  getDappKeyPair,
  getDocumentByUserId,
} from '@/utils/getDocumentByUserId';

const TransactionComponent: React.FC = () => {
  const { deeplink, generateDeeplink } = usePhantomDeeplink();
  const [transaction, setTransaction] = useState<string | null>(null);
  const [deeplinkGenerated, setDeeplinkGenerated] = useState(false);
  const userId = '792924145';

  // Este useEffect solo se ejecutará una vez cuando el componente se monte
  useEffect(() => {
    const createTransaction = async () => {
      const connection = new Connection('https://api.devnet.solana.com');
      const { publicKey: publicKeyString } = await getDocumentByUserId(userId);

      const senderPublicKey = new PublicKey(publicKeyString);
      const tokenMintAddress = new PublicKey(
        'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ',
      );
      const contractPublicKey = new PublicKey(
        '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe',
      );
      const programId = new PublicKey(
        '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe',
      );
      const amount = 100; // Cantidad de tokens SPL (en la mínima unidad)
      const serializedTransaction = await buildTransaction(
        senderPublicKey,
        tokenMintAddress,
        contractPublicKey,
        amount,
        connection,
        programId,
      );

      setTransaction(serializedTransaction);
    };

    createTransaction();
  }, []); // Dependencia vacía para asegurar que solo se ejecute una vez

  // Este useEffect se ejecutará solo cuando `transaction` cambie y si el deeplink no ha sido generado
  useEffect(() => {
    const generateLink = async () => {
      if (transaction && !deeplinkGenerated) {
        const { session, sharedSecretDapp } = await getDocumentByUserId(userId);
        const { publicKey } = await getDappKeyPair(userId);
        console.log('dappKeyPairDocument----->', publicKey);

        const redirectLink =
          'https://pambii-front.vercel.app/api/phantom-redirect';
        const dappEncryptionPublicKey = publicKey;

        generateDeeplink({
          transaction,
          session,
          redirectLink,
          dappEncryptionPublicKey,
          sharedSecret: sharedSecretDapp,
        });

        setDeeplinkGenerated(true); // Marca que el deeplink ha sido generado
      }
    };

    generateLink();
  }, [transaction, deeplinkGenerated]); // Solo se ejecuta cuando `transaction` cambie y el deeplink no ha sido generado

  return (
    <div>
      {deeplink ? (
        <a href={deeplink} target="_blank" rel="noopener noreferrer">
          Firmar en Phantom
        </a>
      ) : (
        <p>Generando deeplink...</p>
      )}
    </div>
  );
};

export default TransactionComponent;
