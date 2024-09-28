import { FunctionComponent } from 'react';
import styles from './SelectBeeContainer.module.css';

const SelectBeeContainer: FunctionComponent = () => {
  return (
    <div className={styles.selectbeecontainer}>
      <div className={styles.text}>The battle has started</div>
      <img className={styles.icon} alt="" src="/assets/attack.svg" />
    </div>
  );
};

export default SelectBeeContainer;
