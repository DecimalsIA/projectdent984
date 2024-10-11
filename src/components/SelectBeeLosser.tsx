import { FunctionComponent } from 'react';
import styles from './SelectBeeContainer.module.css';
import Image from 'next/image';

const SelectBeeLosser: FunctionComponent = () => {
  return (
    <div className={styles.selectbeecontainer}>
      <div className={styles.text}>You lost the battle</div>
      <Image
        className={styles.icon}
        width={20}
        height={20}
        alt=""
        src="/assets/attack.svg"
      />{' '}
      <div className={styles.text}>PAMBII WIN: 50</div>);
      <div className={styles.text}>
        Dont worry, when you lose, you can create a better strategy to beat your
        opponents.
      </div>
    </div>
  );
};

export default SelectBeeLosser;
