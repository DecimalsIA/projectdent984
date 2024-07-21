'use client';

import { useRouter, useParams, usePathname } from 'next/navigation';
import {
  ActionButtonPambii,
  BattleIcon,
  CardPambii,
  ExploreIcon,
  HomeIcon,
  InventoryIcon,
  MarketPlaceIcon,
} from 'pambii-devtrader-front';

const Footer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const activeRoute = pathname.split('/game/')[1];

  return (
    <div className="fixedBotton">
      <CardPambii className="beeCard w-full mb-[7px]">
        <div className="flex w-full ">
          <ActionButtonPambii
            icon={<BattleIcon color="#fff" width="24px" height="24px" />}
            text="battle"
            buttonColor={
              activeRoute === 'battle' ? '#4068f5' : 'rgb(78, 78, 78)'
            }
            onClick={() => router.push('/game/battle')}
          />{' '}
          <ActionButtonPambii
            icon={<ExploreIcon color="#fff" width="24px" height="24px" />}
            text="explore"
            buttonColor={
              activeRoute === 'explore' ? '#4068f5' : 'rgb(78, 78, 78)'
            }
            onClick={() => router.push('/game/explore')}
          />{' '}
          <ActionButtonPambii
            icon={<HomeIcon color="#fff" width="24px" height="24px" />}
            text="home"
            buttonColor={activeRoute === 'home' ? '#4068f5' : 'rgb(78, 78, 78)'}
            onClick={() => router.push('/game/home')}
          />
          <ActionButtonPambii
            icon={<MarketPlaceIcon color="#fff" width="24px" height="24px" />}
            text="market"
            buttonColor={
              activeRoute === 'market' ? '#4068f5' : 'rgb(78, 78, 78)'
            }
            onClick={() => router.push('/game/market')}
          />
          <ActionButtonPambii
            icon={<InventoryIcon color="#fff" width="24px" height="24px" />}
            text="inventory"
            buttonColor={
              activeRoute === 'inventory' ? '#4068f5' : 'rgb(78, 78, 78)'
            }
            onClick={() => router.push('/game/inventory')}
          />
        </div>
      </CardPambii>
    </div>
  );
};

export default Footer;
