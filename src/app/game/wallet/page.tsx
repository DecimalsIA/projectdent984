'use client';

import Globe from '@/components/icons/Globe';
import { useRouter } from 'next/navigation';
import { TablePambii } from 'pambii-devtrader-front';

const WalletPage: React.FC = () => {
  const handleClick = (name: string) => {
    alert(`Clicked on ${name}`);
  };
  const beeData = [
    {
      name: 'English',
      text: 'English',
      icon: <Globe />,
      onClick: () => handleClick('LANGUAJE'),
    },
    {
      name: 'Español',
      text: 'Spanish',
      icon: <Globe />,
      onClick: () => handleClick('LANGUAJE'),
    },
    {
      name: '中国人',
      text: 'Chinese',
      icon: <Globe />,
      onClick: () => handleClick('中国人'),
    },
    {
      name: '한국인',
      text: 'Korean',
      icon: <Globe />,
      onClick: () => handleClick('한국인'),
    },
  ];

  const router = useRouter();
  return (
    <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
      <TablePambii className="w-full" data={beeData} />
    </div>
  );
};

export default WalletPage;
