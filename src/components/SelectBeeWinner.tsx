import { FunctionComponent } from 'react';
import styles from './SelectBeeContainer.module.css';
import Image from 'next/image';

const SelectBeeWinner: FunctionComponent = () => {
  return (
    <div className={styles.selectbeecontainer}>
      <div className={styles.text}>You won the battle</div>
      <Image
        className={styles.icon}
        width={20}
        height={20}
        alt=""
        src="/assets/attack.svg"
      />
      <div className={styles.text}>PAMBII WIN: 50</div>);
      <div className={styles.text}>
        Go claim your rewards for being the best bee master.
      </div>
    </div>
  );
};

export default SelectBeeWinner;
