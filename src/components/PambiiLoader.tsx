'use client';
import Image from 'next/image';
import { LogoGame } from 'pambii-devtrader-front';

const PambiiLoader: React.FC = () => {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center font-pop mt-8">
      <div className="w-[315px] h-[341px] flex flex-col items-center justify-start gap-6">
        <div>
          {' '}
          <LogoGame className="w-100 h-100 mb-4" />
        </div>
        <div>
          <Image
            src="/panal_animado.gif"
            width={120}
            height={120}
            alt="Picture of the author"
          />
        </div>

        <div className="text-center  font-bold font-['Poppins'] leading-none tracking-tight">
          <div className="loading-container">
            <div className="loading-text">
              <span>L</span>
              <span>O</span>
              <span>A</span>
              <span>D</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PambiiLoader;
