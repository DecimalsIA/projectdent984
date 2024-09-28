import { FunctionComponent } from 'react';
import styles from './SelectBeeContainer.module.css';
import Image from 'next/image';

const SelectBeeContainer: FunctionComponent = () => {
  return (
    <div className={styles.selectbeecontainer}>
      <div className={styles.text}>The battle has started</div>
      <Image
        className={styles.icon}
        width={20}
        height={20}
        alt=""
        src="/assets/attack.svg"
      />
    </div>
  );
};

export default SelectBeeContainer;
