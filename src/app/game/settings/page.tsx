'use client';

import Delete from '@/components/icons/Delete';
import Globe from '@/components/icons/Globe';
import ModalPambii from '@/components/ModalPambii';
import { useRouter } from 'next/navigation';
import { BeeIcon, FireAnimated, TablePambii } from 'pambii-devtrader-front';
import { useState } from 'react';
import { TbDoorExit } from 'react-icons/tb';
import { LuUserCircle } from 'react-icons/lu';
import { useTelegram } from '@/context/TelegramContext';

const SettingsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useTelegram();
  const handleModal = () => {
    setIsModalOpen(true);
  };
  const modalData = {
    title: 'DELETE ACCOUNT',
    subtitle:
      'Do you want to delete your account permanently? Remember that this action is reversible and all your data will be permanently deleted.',
    buttons: [
      {
        text: 'DELETE ACCOUNT',
        bg: '#ea5555',
        color: 'white',
        w: 'full',
        icon: <Delete />,
        onClick: () => alert('DELETE ACCOUNT'),
      },
    ],

    onClose: () => setIsModalOpen(false),
  };

  const beeData = [
    {
      name: 'USER NAME',
      text: user?.first_name ?? 'BEE',
      icon: <LuUserCircle />,
      onClick: () => {},
    },
    {
      name: 'LANGUAJE',
      text: 'EN',
      icon: <Globe />,
      onClick: () => router.push('/game/settings/languaje'),
    },
    {
      name: 'LOGOUT',
      icon: <TbDoorExit />,
      onClick: () => handleModal(),
    },
  ];

  return (
    <>
      {' '}
      {isModalOpen && <ModalPambii data={modalData} />}
      <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
        <TablePambii className="w-full" data={beeData} />
      </div>
    </>
  );
};

export default SettingsPage;
