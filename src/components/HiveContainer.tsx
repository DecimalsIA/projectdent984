/* eslint-disable @next/next/no-img-element */
import { FunctionComponent, useCallback } from 'react';
import styles from './HiveContainer.module.css';

const HiveContainer: FunctionComponent = () => {
  const onHiveContainerClick = useCallback(() => {
    // Add your code here
  }, []);
  // Buy your bee to continue
  return (
    <div className={styles.hivecontainer} onClick={onHiveContainerClick}>
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
        <img
          className={styles.panal1Icon}
          alt=""
          width="120px"
          src="/Pambii-bee.webp"
        />
      </div>

      <div className={styles.clickTheHive}>30.673 Bees Left to mint</div>
    </div>
  );
};

export default HiveContainer;
