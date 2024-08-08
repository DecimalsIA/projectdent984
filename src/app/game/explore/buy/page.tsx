'use client';
import React from 'react';
import usePhantomSignTransaction from '@/hooks/usePhantomSignTransaction';

const SignTransactionPage: React.FC = () => {
  const userId = 'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3'; // Reemplazar con el ID real del usuario
  const programId = 'AceRYkKX6mWc8TtkaCevPhDpjjMBEode75Kn59XtTdVX'; // Reemplazar con el ID del programa
  const baseAccount = '9nJwpxx1A7yZeVFp5qBHwg5eDSfMjMDyam3ZDFVxmd4Y'; // Reemplazar con la cuenta base
  const user = 'EbyUWNGQ8MJPYR8xBqap5J3G4NVJCgQcTuQgzExYqvL3'; // Reemplazar con la clave pública del usuario
  const newValue = 42; // Valor a enviar en lamports
  const redirectLink = 'https://pambii-front.vercel.app/api/phantom-redirect'; // URL de redirección después de la firma de la transacción

  const { url, error } = usePhantomSignTransaction(
    userId,
    programId,
    baseAccount,
    user,
    newValue,
    redirectLink,
  );

  return (
    <div>
      <h1>Sign Transaction with Phantom Wallet</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          Sign Transaction with Phantom
        </a>
      ) : (
        <p>Generating transaction signing URL...</p>
      )}
    </div>
  );
};

export default SignTransactionPage;
