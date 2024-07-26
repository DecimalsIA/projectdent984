import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ActionButtonPambii,
  SettingIcon,
  WalletIcon,
} from 'pambii-devtrader-front';

interface UserHome {
  userName?: string;
  userImage?: string;
}

const UserHome: React.FC<UserHome> = ({
  userName = 'Dallas Crypto',
  userImage = '/Pambii-bee.webp',
}) => {
  const router = useRouter();
  return (
    <div className="extraoptionscontainer w-full">
      <div className="userinfocontainer">
        <Image
          className="userinfocontainerChild boder-img"
          alt="User"
          src={userImage || ''}
          width={50}
          height={50}
          placeholder="blur"
          blurDataURL="/Pambii-bee.webp"
        />
        <div className="beenametext">{userName}</div>
      </div>
      <div className="userinfocontainer">
        <ActionButtonPambii
          icon={<WalletIcon color="#fff" width="24px" height="24px" />}
          onClick={() => router.push('/game/wallet')}
        />
        <ActionButtonPambii
          icon={<SettingIcon color="#fff" width="24px" height="24px" />}
          onClick={() => router.push('/game/settings')}
        />
      </div>
    </div>
  );
};

export default UserHome;
