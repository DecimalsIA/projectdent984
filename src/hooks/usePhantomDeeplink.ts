import { useState } from 'react';
import bs58 from 'bs58';
import { buildUrl } from '@/utils/buildUrl';
import { encryptPayload } from '@/utils/encryptPayload';


interface DeeplinkParams {
  transaction: string;
  session: string;
  redirectLink: string;
  dappEncryptionPublicKey: string;
  sharedSecret: string; // Se espera que el sharedSecret sea enviado como un string
}

const usePhantomDeeplink = () => {
  const [deeplink, setDeeplink] = useState<string | null>(null);

  const generateDeeplink = ({
    transaction,
    session,
    redirectLink,
    dappEncryptionPublicKey,
    sharedSecret,
  }: DeeplinkParams) => {
    try {
      const payload = JSON.stringify({
        transaction,
        session,
      });



      // Usa la función encryptPayload para cifrar el payload
      //const { nonce, encryptedPayload } = encryptPayload({ payload, sharedSecret });
      const sharedSecretkey = bs58.decode(sharedSecret);
      const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecretkey);

      const params = new URLSearchParams({
        dapp_encryption_public_key: dappEncryptionPublicKey,
        nonce: bs58.encode(nonce),
        redirect_link: redirectLink,
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
