'use client';

import { useRouter } from 'next/navigation';
import { BeeIcon, TablePambii } from 'pambii-devtrader-front';

const SettingsPage: React.FC = () => {
  const handleClick = (name: string) => {
    alert(`Clicked on ${name}`);
  };
  const beeData = [
    {
      name: 'LANGUAJE',
      text: 'ENDN',
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('LANGUAJE'),
    },
    {
      name: 'DELETE ACCOUNT',
      icon: <BeeIcon className="text-orange-500" />,
      onClick: () => handleClick('DELETE ACCOUNT'),
    },
  ];

  const router = useRouter();
  return (
    <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
      <TablePambii className="w-full" data={beeData} />
    </div>
  );
};

export default SettingsPage;
