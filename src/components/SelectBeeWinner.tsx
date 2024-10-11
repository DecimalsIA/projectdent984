import { FunctionComponent } from 'react';
import styles from './SelectBeeContainer.module.css';
import Image from 'next/image';
import { ButtonPambii, IconPambii } from 'pambii-devtrader-front';
import { useRouter } from 'next/navigation';

const SelectBeeWinner: FunctionComponent = () => {
  const router = useRouter();
  const gotoHome = () => {
    router.push('/game/home');
  };
  return (
    <div className={styles.selectbeecontainer}>
      <div className={styles.text}>You win the battle</div>
      <Image
        className={styles.icon}
        width={20}
        height={20}
        alt=""
        src="/assets/wins.svg"
      />
      <div className={styles.text}>PAMBII WIN: 50</div>
      <div className={styles.text}>
        Go claim your rewards for being the best bee master.
      </div>
      <div>
        {' '}
        <ButtonPambii
          color="white"
          bg="#4e4e4e"
          className="mb-2"
          onClick={gotoHome}
          icon={<IconPambii />}
        >
          Go to Home
        </ButtonPambii>
      </div>
    </div>
  );
};

export default SelectBeeWinner;
