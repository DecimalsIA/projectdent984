import { useState } from 'react'; 
import bs58 from 'bs58';
import { buildUrl } from '@/utils/buildUrl';
import { encryptPayload } from '@/utils/encryptPayload';

// No se elimina ni modifica nada de lo original, sólo se añade:

interface DeeplinkParams {
  transaction: string;
  session: string;
  redirectLink: string;
  dappEncryptionPublicKey: string;
  sharedSecret: string; // Se espera que el sharedSecret sea enviado como un string

  // (ADDED) Campos opcionales para que no se pierdan por query string:
  fromTrn?: string;
  bee?: string;
  map?: string;
}

const usePhantomDeeplink = () => {
  const [deeplink, setDeeplink] = useState<string | null>(null);

  const generateDeeplink = ({
    transaction,
    session,
    redirectLink,
    dappEncryptionPublicKey,
    sharedSecret,

    // (ADDED) Recolectamos también estos parámetros
    fromTrn,
    bee,
    map,
  }: DeeplinkParams) => {
    try {
      const sendOptions = {
        skipPreflight: true,            // Omitir la simulación preflight
        maxRetries: 3,                  // Intentar hasta 3 veces en caso de fallos
        preflightCommitment: 'finalized',  // Asegurar que la transacción esté finalizada
      };

      // (ADDED) Codificamos la redirectLink para evitar caracteres conflictivos
      const encodedRedirectLink = encodeURIComponent(redirectLink);

      // (ADDED) Agregamos fromTrn, bee y map al payload
      const payload = {
        transaction,
        session,
        fromTrn,
        bee,
        map,
        sendOptions
      };

      const sharedSecretkey = bs58.decode(sharedSecret);
      const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecretkey);

      const params = new URLSearchParams({
        dapp_encryption_public_key: dappEncryptionPublicKey,
        nonce: bs58.encode(nonce),
        // (ADDED) Usamos la URL codificada
        redirect_link: encodedRedirectLink,
        payload: bs58.encode(encryptedPayload),
      });

      const deeplinkUrl = buildUrl('signAndSendTransaction', params);

      setDeeplink(deeplinkUrl);
    } catch (error) {
      console.error('Error generating Phantom deeplink:', error);
      setDeeplink(null);
    }
  };

  return {
    deeplink,
    generateDeeplink,
  };
};

export default usePhantomDeeplink;