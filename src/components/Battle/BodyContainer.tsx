import { FunctionComponent } from 'react';
import styles from './BodyContainer.module.css';

const BodyContainer: FunctionComponent = () => {
  return (
    <div className={styles.bodycontainer}>
      <div className={styles.extraoptionscontainer}>
        <div className={styles.beenametext}>BATTLE</div>
      </div>
    </div>
  );
};

export default BodyContainer;
