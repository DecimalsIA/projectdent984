'use client';

import { useRouter } from 'next/navigation';
import { BeeIcon, TablePambii } from 'pambii-devtrader-front';
import { GrMoney } from 'react-icons/gr';
import { GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi';
import { useAccountInfoToken } from '@/hooks/useAccountInfoToken';
import { useTelegram } from '@/context/TelegramContext';
import useGetExplorer from '@/hooks/usGetExplorer';
function formatLargeNumber(number: number) {
  const units = ['B', 'M', 'K'];
  const thresholds = [1e9, 1e6, 1e3];

  for (let i = 0; i < thresholds.length; i++) {
    if (number >= thresholds[i]) {
      const value = (number / thresholds[i]).toFixed(0);
      return `${value} ${units[i]}`;
    }
  }

  return number.toString(); // Return the original number if it's smaller than 1,000
}
const WalletPage: React.FC = () => {
  const { user } = useTelegram();
  const router = useRouter();

  const userid = user?.id.toString() ?? '792924145';
  const handleClick = (name: string) => {
    alert(`Clicked on ${name}`);
  };
  const { accountInfo } = useAccountInfoToken(userid);
  const { totalPayout } = useGetExplorer(userid);
  const beeData = [
    {
      name: 'BALANCE PAMBII',
      text: formatLargeNumber(Number(accountInfo?.amount.toString())),
      icon: <BeeIcon />,
      onClick: () => handleClick('LANGUAJE'),
    },
    {
      name: 'AVAILABLE FOR WITHDRAWAL',
      text: totalPayout + ' PAMBI',
      icon: <GiReceiveMoney />,
      onClick: () => handleClick('LANGUAJE'),
    },
    {
      name: 'Buy PAMBII',
      icon: <GiTakeMyMoney />,
      onClick: () =>
        router.push(
          'https://phantom.app/ul/browse/https://raydium.io/swap/?inputMint=sol&outputMint=8dGUaPCybF4e2EbqtKcDsvW74shNTsabd5M6z6zG9BN2&ref=https://raydium.io/swap/?inputMint=sol%26outputMint=8dGUaPCybF4e2EbqtKcDsvW74shNTsabd5M6z6zG9BN2',
        ),
    },
  ];

  return (
    <div className='className="bg-cover bg-center flex flex-col p-4 w-full'>
      <TablePambii className="w-full" data={beeData} />
    </div>
  );
};

export default WalletPage;
