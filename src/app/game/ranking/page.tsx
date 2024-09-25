'use client';

import useGroupedUserTransactions from '@/hooks/useGroupedUserTransactions';
import { useRouter } from 'next/navigation';
import {
  BeeIcon,
  RankingIcon,
  StatsIcon,
  TablePambii,
  TabsPambii,
} from 'pambii-devtrader-front';

const RankingPage: React.FC = () => {
  const userTransactions = useGroupedUserTransactions(); // Obtener los datos de los usuarios agrupados
  const router = useRouter();

  console.log(userTransactions);

  // Función para mapear las transacciones de usuario al formato esperado por beeData
  const beeData = userTransactions.map((user) => ({
    name: user.nomTlram || 'Usuario desconocido', // Si el username no está disponible
    level: user.count, // Suponemos que "level" es el número de transacciones (ajusta esto según tu lógica)
    icon: <BeeIcon className="text-orange-500" />, // Icono de la abeja para todos
    onClick: () => {}, // Acción al hacer clic
  }));

  const tabs = [
    {
      title: 'Ranking',
      icon: <RankingIcon />,
      onClick: () => router.push('/game/ranking'),
      state: 'active',
    },
    {
      title: 'Stats',
      icon: <StatsIcon />,
      inactiveTabColor: 'active',
      onClick: () => router.push('/game/stats'),
    },
  ];

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full">
      <div className="w-full">
        <TabsPambii
          tabs={tabs}
          mode="background"
          bg="#2a2a2a"
          className="mt-4 mb-3"
        />
      </div>
      <div className="mb-4">
        {' '}
        <h2>Exploration Results</h2>
      </div>
      <TablePambii className="w-full" data={beeData} />
    </div>
  );
};

export default RankingPage;
