'use client';
import { useTranslations } from 'next-intl';
import { LogoGame } from 'pambii-devtrader-front';
import { QRCode } from 'react-qrcode-logo';

const NotTelegramMobile: React.FC = () => {
  const t = useTranslations('NotTelegramMobile');
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center font-pop mt-8">
      <div className="w-[315px] h-[341px] flex flex-col items-center justify-start gap-6">
        <div>
          {' '}
          <LogoGame className="w-100 h-100 mb-4" />
        </div>
        <div>
          <QRCode
            value="https://t.me/PambiiGameBot/pambii"
            logoImage="Pambii-bee.webp"
            qrStyle="dots"
            eyeRadius={[2, 2, 2, 2]}
            fgColor="#f9b22b"
            bgColor="#292929"
            style={{
              borderRadius: '10px',
              border: '1px solid #434343',
            }}
          />
        </div>
        <div className="text-center">
          <p> {t('title')}</p>
          <span
            style={{
              color: 'white',
              fontSize: '2xl',
              fontWeight: 'medium',
              fontFamily: 'Poppins',
              lineHeight: 'normal',
              letterSpacing: 'wide',
            }}
          >
            Scan{' '}
          </span>
          <span
            style={{
              color: 'white',
              fontSize: '2xl',
              fontWeight: 'bold',
              fontFamily: 'Poppins',
              lineHeight: 'normal',
              letterSpacing: 'wide',
            }}
          >
            QR
          </span>
          <span
            style={{
              color: 'white',
              fontSize: '2xl',
              fontWeight: 'medium',
              fontFamily: 'Poppins',
              lineHeight: 'normal',
              letterSpacing: 'wide',
            }}
          >
            {' '}
            {t('sub_title')}{' '}
          </span>
        </div>

        <div className="text-center text-zinc-600 text-base font-medium font-['Poppins'] leading-none tracking-tight">
          <p> {t('ext_title')}</p>
        </div>
      </div>
    </div>
  );
};

export default NotTelegramMobile;
