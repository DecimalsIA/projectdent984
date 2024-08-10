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
  NavFloatButtons,
} from 'pambii-devtrader-front';
import { FaShoppingBasket } from 'react-icons/fa';

const Footer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  console.log('pathname', pathname);
  if (pathname == '/game') return;
  const activeRoute = pathname.split('/game/')[1];
  const activePath = activeRoute.split('/')[0];
  const activePathFt = activeRoute.split('/')[1];
  const navButtons = [
    {
      text: 'SPECIAL MARKET',
      iconComponent: (
        <MarketPlaceIcon color="#fff" width="24px" height="24px" />
      ),
      url: '',
      onClick: () => router.push('/game/market/special'),
      active: activePathFt === 'special' ? true : false,
    },
    {
      text: 'PUBLIC MARKET',
      iconComponent: (
        <FaShoppingBasket className="w-[24px] h-[24px]" color="#fff" />
      ), // Ejemplo de componente de ícono
      url: '',
      onClick: () => router.push('/game/market/public'),
      active: activePathFt === 'public' ? true : false,
    },
  ];

  return (
    <div className="fixedBotton z-20">
      {activePath === 'market' && (
        <NavFloatButtons classNav="btonNav" navButtons={navButtons} />
      )}

      <CardPambii className="beeCard w-full mb-[7px]">
        <div className="flex w-full ">
          <ActionButtonPambii
            icon={<BattleIcon color="#fff" width="24px" height="24px" />}
            text="battle"
            buttonColor={
              activePath === 'battle' ? '#4068f5' : 'rgb(78, 78, 78)'
            }
            onClick={() => router.push('/game/battle')}
          />{' '}
          <ActionButtonPambii
            icon={<ExploreIcon color="#fff" width="24px" height="24px" />}
            text="explore"
            buttonColor={
              activePath === 'explore' ? '#4068f5' : 'rgb(78, 78, 78)'
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
              activePath === 'market' ? '#4068f5' : 'rgb(78, 78, 78)'
            }
            onClick={() => router.push('/game/market')}
          />
          <ActionButtonPambii
            icon={<InventoryIcon color="#fff" width="24px" height="24px" />}
            text="inventory"
            buttonColor={
              activePath === 'inventory' ? '#4068f5' : 'rgb(78, 78, 78)'
            }
            onClick={() => router.push('/game/inventory')}
          />
        </div>
      </CardPambii>
    </div>
  );
};

export default Footer;
