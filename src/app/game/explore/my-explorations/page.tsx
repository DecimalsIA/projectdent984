'use client';

import ExplorationInfo from '@/components/Exploration';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ButtonPambii, CardPambii, SlidePambii } from 'pambii-devtrader-front';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import TransactionComponent from '@/components/TransactionComponent';
import { useTelegram } from '@/context/TelegramContext';
import useVerifyPayment from '@/hooks/useVerifyPayment';
import ExplorationPlay from '@/components/ExplorationPlay';
import useGetBee from '@/hooks/useGetBee';
import useGetExplorer from '@/hooks/usGetExplorer';
import './myexplorer.css';

type Power = {
  power: string;
  powerIcon: JSX.Element;
};

type Ability = {
  id: number;
  name: string;
  icon: JSX.Element;
};

type Progress = {
  // define the properties of progress, e.g.:
  percentage: number;
};
interface ExplorerData {
  map: string; // Cambia 'string' al tipo correcto si es necesario
  // otras propiedades aquí si existen
}

type BeeData = {
  image: string;
  title: string;
  abilitiesData: Ability[];
  power: Power[] | null;
  progress: Progress;
  type: string;
  id: string;
  map: string;
  index: number;
};

const ExplorePage: React.FC = () => {
  const { user } = useTelegram();
  const userId = user?.id?.toString() ?? '792924145';
  const router = useRouter();

  const { bees } = useGetBee(userId);
  const { totalRecords, totalPayout, experience, win, loss, explorer } =
    useGetExplorer(userId);

  const [slideData, setSlideData] = useState<any[]>([]);

  const [lockState, setLockState] = useState(false);

  const { exists, data } = useVerifyPayment(userId);

  useEffect(() => {
    if (explorer && explorer.length > 0) {
      const mappedSlideData: any[] = explorer.map((bee: any, index) => ({
        bee,
        index: index,
      }));

      setSlideData(mappedSlideData);
    }
  }, [bees]);

  useEffect(() => {
    if (exists && data) {
      const now = Date.now();
      const difference = data.timeLock - now;
      console.log('difference', difference, difference <= 0);
      setLockState(difference <= 0);
    }
  }, [exists, data]);

  console.log('lockState', lockState);

  if (!bees || slideData.length === 0) {
    return <div>Loading...</div>; // Muestra un indicador de carga mientras se inicializan los datos
  }
  console.log('bees');
  return (
    <>
      <>
        <div className=" w-full bg-cover bg-center flex flex-col items-center justify-between p-4">
          {slideData &&
            slideData.map((data, index) => {
              console.log('------', data);
              // {'/assets/bee-characters/icons/' + dificultad + '.svg'}
              const mybee: any = bees.find(
                (abeja) => abeja.id === data.bee.bee,
              );
              console.log('mybee', mybee);
              return mybee ? (
                <CardPambii
                  type={data.bee.map}
                  className="bg-gray-200 w-full card-pambii-b  text-black flex items-center justify-center"
                  key={index}
                >
                  <div className="generalinfo">
                    <div className="image">
                      <Image
                        src={'/assets/bee-characters/' + mybee?.image + '.png'}
                        alt={mybee?.title}
                        width={80}
                        height={80}
                        className="cabezaveneno1Icon"
                      />
                    </div>
                    <div className="nameandtype">
                      <div className="text">{mybee?.title}</div>
                      <div className="badge">
                        <Image
                          src={'/assets/bee-characters/icons/dollar.svg'}
                          alt={data.bee.map}
                          width={24}
                          height={24}
                          className="boldMedicineSyringe"
                        />

                        <div className="badgetext text-cyan-100">
                          {data.bee.explorationPlay.payout}
                        </div>
                      </div>
                      <div className="badge">
                        <Image
                          src={
                            '/assets/bee-characters/icons/' +
                            data.bee.map +
                            '.svg'
                          }
                          alt={data.bee.map}
                          width={24}
                          height={24}
                          className="boldMedicineSyringe"
                        />

                        <div className="badgetext text-cyan-100">
                          {data.bee.map}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ButtonPambii
                    color="white"
                    className="mb-2"
                    onClick={() => router.push('/game/explore/' + data.bee.map)}
                    icon={
                      <Image
                        src="/assets/bee-characters/icons/explore-icon.svg"
                        alt="Select arena"
                        width={24}
                        height={24}
                      />
                    }
                  >
                    Repeat Exploration
                  </ButtonPambii>
                </CardPambii>
              ) : (
                <div key={index}>Bee with id {data.id} not found</div>
              );
            })}
        </div>
      </>
    </>
  );
};

export default ExplorePage;
