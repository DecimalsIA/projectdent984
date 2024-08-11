/* eslint-disable @next/next/no-img-element */
import { FunctionComponent, useCallback } from 'react';
import styles from './HiveContainer.module.css';
import Image from 'next/image';

const HiveContainer: FunctionComponent = () => {
  // Buy your bee to continue
  return (
    <div className={styles.hivecontainer}>
      <div className={styles.clickTheHiveContainer}>
        <span>
          <span className={styles.clickThe}>{`Buy  `}</span>
          <span className={styles.hive}>BEE 🐝</span>
          <span className={styles.clickThe}>{` To continue`}!</span>
        </span>
        <br />
        <span className={styles.bee}>100 Pambii!</span>
        <span className={styles.toRecieveOne}> </span>
      </div>
      <div className=" flex center-div p-4 justify-center align-middle">
        <Image
          src="/panal_animado.gif"
          width={140}
          height={140}
          alt="Picture of the author"
          unoptimized
        />
      </div>

      <div className={styles.clickTheHive}>30.673 Bees Left to mint</div>
    </div>
  );
};

export default HiveContainer;
