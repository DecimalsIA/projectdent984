'use client';

import { useTelegram } from '@/context/TelegramContext';
import useGetBee from '@/hooks/useGetBee';

import useGroupedExplorationResults from '@/hooks/useGroupedExplorationResults'; // Importamos el nuevo hook
import useGetExplorer from '@/hooks/usGetExplorer';
import { useRouter } from 'next/navigation';
import {
  BeeIcon,
  RankingIcon,
  StatsIcon,
  TablePambii,
  TabsPambii,
} from 'pambii-devtrader-front';

const StatsPage: React.FC = () => {
  const { user } = useTelegram();
  const userid = user?.id.toString() ?? '792924145';
  const { bees, loading } = useGetBee(userid);
  const { totalPayout, experience } = useGetExplorer(userid);

  // Usamos el nuevo hook para obtener los resultados agrupados de exploración
  const explorationResults = useGroupedExplorationResults();

  const beeData: any = bees.map((bee, index) => ({
    image: '/assets/bee-characters/' + bee.image + '.png',
    name: bee.title ? bee.title.toUpperCase() : 'UNKNOWN',
    abilitiesData: bee.abilitiesData,
    power: bee.powers && bee.powers.length > 0 ? bee.powers : null,
    progress: bee.progress,
    index: index,
    id: bee.id,
    level: 1,
    icon: <BeeIcon className="text-orange-500" />,
  }));

  // Mapear los resultados de exploración agrupados al formato esperado por TablePambii
  const explorationData: any = explorationResults.map((result, index) => ({
    name: `User: ${result.userId}`, // Puedes cambiar esto si tienes el nombre de usuario
    level: result.wins, // Mostrar las victorias como nivel
    icon: <BeeIcon className="text-orange-500" />, // Icono de abeja
    progress: result.wins, // Puedes mostrar el progreso como las victorias
    losses: result.losses, // Mostrar el número de derrotas
    index: index,
    onClick: () => alert(`Clicked on User: ${result.userId}`), // Acción de clic
  }));

  const tabs = [
    {
      title: 'Ranking',
      icon: <RankingIcon />,
      onClick: () => router.push('/game/ranking'),
    },
    {
      title: 'Stats',
      icon: <StatsIcon />,
      onClick: () => router.push('/game/stats'),
      state: 'active',
    },
  ];

  const router = useRouter();
  return (
    <div className='className="min-h-screen bg-cover bg-center flex flex-col p-4 w-full'>
      <div className="w-full">
        <TabsPambii
          tabs={tabs}
          mode="background"
          bg="#2a2a2a"
          className="mt-4 mb-3"
        />
      </div>
      {/* Mostrar datos de las abejas 
      {beeData && <TablePambii className="w-full" data={beeData} />}*/}

      {/* Mostrar los resultados de las exploraciones agrupadas */}
      {explorationData && (
        <div>
          <TablePambii className="w-full" data={explorationData} />
        </div>
      )}
    </div>
  );
};

export default StatsPage;
