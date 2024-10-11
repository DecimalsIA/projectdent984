import { FunctionComponent } from 'react';
import styles from './SelectBeeContainer.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ButtonPambii, IconPambii } from 'pambii-devtrader-front';

const SelectBeeLosser: FunctionComponent = () => {
  const router = useRouter();
  const gotoHome = () => {
    router.push('/game/home');
  };
  return (
    <div className={styles.selectbeecontainer}>
      <div className={styles.text}>You lost the battle</div>
      <Image
        className={styles.icon}
        width={20}
        height={20}
        alt=""
        src="/assets/loss.svg"
      />{' '}
      <div className={styles.text}>PAMBII LOSS: 50</div>);
      <div className={styles.text}>
        Dont worry, when you lose, you can create a better strategy to beat your
        opponents.
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

export default SelectBeeLosser;
