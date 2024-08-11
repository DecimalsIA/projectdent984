import { useAccountInfoToken } from '@/hooks/useAccountInfoToken';
import Image from 'next/image';
import { ButtonPambii } from 'pambii-devtrader-front';
import React from 'react';

interface NoSaldoComponentProps {
  id: string;
}

const NoSaldo: React.FC<NoSaldoComponentProps> = ({ id }) => {
  const { accountInfo, loading, error } = useAccountInfoToken(id);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {accountInfo ? (
        <a
          href="https://phantom.app/ul/browse/https://raydium.io/swap/?inputMint=sol&outputMint=8dGUaPCybF4e2EbqtKcDsvW74shNTsabd5M6z6zG9BN2&ref=https://raydium.io/swap/?inputMint=sol%26outputMint=8dGUaPCybF4e2EbqtKcDsvW74shNTsabd5M6z6zG9BN2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="hivecontainer flex">
            <div className="clickTheHive flex-wrap justify-center text-center w-[280px]">
              You do not have a balance in PAMBII, you can buy where the button
            </div>
          </div>
          <ButtonPambii
            color="white"
            bg="#131e39"
            className="mb-2"
            icon={
              <Image
                src="https://www.pambi.tech/_next/static/media/raydium.3e1cb57d.svg"
                alt="Select arena"
                width={24}
                height={24}
              />
            }
          >
            buy Pambii on Raydium
          </ButtonPambii>{' '}
        </a>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default NoSaldo;
