/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import usePhantomDeeplink from '../hooks/usePhantomDeeplink';
import { buildWithdrawTransaction } from '../utils/buildWithdrawTransaction'; // Usar la función que creamos
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
  idBuy?: any;
  iconName?: any;
  onClicker?: () => void;
}

const TransactionRetiroComponent: React.FC<ExplorationCardGameProps> = ({
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
  const [deeplinkGenerated, setDeeplinkGenerated] = useState(false);

  // Este useEffect solo se ejecutará una vez cuando el componente se monte
  useEffect(() => {
    const createTransaction = async () => {
      const connection = new Connection('https://api.mainnet.solana.com');
      const programId = new PublicKey(
        '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe',
      ); // Program ID del contrato
      const tokenMintAddress = new PublicKey(
        'HPsGKmcQqtsT7ts6AAeDPFZRuSDfU4QaLWAyztrY5UzJ',
      ); // Mint del token
      const contractPublicKey = new PublicKey(
        '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe',
      ); // La cuenta del contrato
      const contractAuthorityPublicKey = new PublicKey(
        '3SSUkmt5HfEqgEmM6ArkTUzTgQdGDJrRGh29GYyJshfe',
      ); // Autoridad del contrato (puede ser la misma en algunos casos)

      // Obtener la clave pública del usuario desde un servicio
      const { publicKey: publicKeyString } = await getDocumentByUserId(userid);
      const senderPublicKey = new PublicKey(publicKeyString);

      const amount = spl; // Cantidad de tokens SPL en la mínima unidad

      try {
        // Construcción de la transacción de retiro
        const serializedTransaction = await buildWithdrawTransaction(
          senderPublicKey,
          tokenMintAddress,
          contractPublicKey,
          contractAuthorityPublicKey,
          amount,
          connection,
          programId,
        );

        setTransaction(serializedTransaction);
      } catch (error) {
        console.error('Error al construir la transacción de retiro:', error);
      }
    };

    createTransaction();
  }, [userid, spl]); // Se asegura de ejecutar la transacción cuando cambian `userid` o `spl`

  // Este useEffect se ejecutará solo cuando `transaction` cambie y si el deeplink no ha sido generado
  useEffect(() => {
    const generateLink = async () => {
      if (transaction && !deeplinkGenerated) {
        const { session, sharedSecretDapp } = await getDocumentByUserId(userid);
        const { publicKey } = await getDappKeyPair(userid);

        const redirectLink = `https://pambii-front.vercel.app/api/phantom-redirect-sing?userId=${userid}&fromTrn=${fromTrn}${
          bee ? `&bee=${bee}` : ''
        }${map ? `&map=${map}` : ''}${idBuy ? `&idBuy=${idBuy}` : ''}`;

        const dappEncryptionPublicKey = publicKey;

        // Generar el deeplink para Phantom
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
  }, [transaction, deeplinkGenerated, userid]); // Solo se ejecuta cuando `transaction` o `deeplinkGenerated` cambian

  return (
    <div className="w-full">
      {deeplink ? (
        <a href={deeplink} target="_blank" rel="noopener noreferrer">
          <ButtonPambii
            color="white"
            className="mb-2"
            onClick={onClicker}
            icon={
              <Image
                src={'/assets/bee-characters/icons/dollar.svg'}
                alt="Retirar tokens"
                width={24}
                height={24}
              />
            }
          >
            {textButton ? textButton : 'Retirar'} {spl} PAMBII
          </ButtonPambii>
        </a>
      ) : (
        <p className="center text-cyan-50">Generando transacción...</p>
      )}
    </div>
  );
};

export default TransactionRetiroComponent;
