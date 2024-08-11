/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import usePhantomDeeplink from '../hooks/usePhantomDeeplink';
import { buildTransaction } from '../utils/buildTransaction';

import {
  getDappKeyPair,
  getDocumentByUserId,
} from '@/utils/getDocumentByUserId';
import { ButtonPambii } from 'pambii-devtrader-front';
import Image from 'next/image';
interface ExplorationCardGameProps {
  spl: number;
  userid: string;
  textButton?: string;
  fromTrn: string;
  bee?: any;
  map?: any;
}

const TransactionComponent: React.FC<ExplorationCardGameProps> = ({
  spl,
  userid,
  textButton,
  fromTrn,
  bee,
  map,
}) => {
  const { deeplink, generateDeeplink } = usePhantomDeeplink();
  const [transaction, setTransaction] = useState<string | null>(null);
  const [deeplinkGenerated, setDeeplinkGenerated] = useState(false);

  // Este useEffect solo se ejecutará una vez cuando el componente se monte
  useEffect(() => {
    const createTransaction = async () => {
      const connection = new Connection('https://api.devnet.solana.com');
      const sc = '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe';
      const token = 'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ';
      const { publicKey: publicKeyString } = await getDocumentByUserId(userid);

      const senderPublicKey = new PublicKey(publicKeyString);
      const tokenMintAddress = new PublicKey(token);
      const contractPublicKey = new PublicKey(sc);
      const programId = new PublicKey(sc);
      const amount = spl; // Cantidad de tokens SPL (en la mínima unidad)
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
        const { session, sharedSecretDapp } = await getDocumentByUserId(userid);
        const { publicKey } = await getDappKeyPair(userid);

        const redirectLink = `https://pambii-front.vercel.app/api/phantom-redirect-sing?userId=${userid}&fromTrn=${fromTrn}${
          bee ? `&bee=${bee}` : ''
        }${map ? `&map=${map}` : ''}`;

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
    <div className="w-full">
      {deeplink ? (
        <a href={deeplink} target="_blank" rel="noopener noreferrer">
          <ButtonPambii
            color="white"
            className="mb-2"
            icon={
              <Image
                src="/assets/bee-characters/icons/explore-icon.svg"
                alt="Select arena"
                width={24}
                height={24}
              />
            }
          >
            {textButton ? textButton : 'Select bee to explore'}
          </ButtonPambii>{' '}
        </a>
      ) : (
        <p className="center text-cyan-50"></p>
      )}
    </div>
  );
};

export default TransactionComponent;
