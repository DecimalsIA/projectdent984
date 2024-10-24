import { FunctionComponent } from 'react';
import styles from './LevelBar.module.css';

interface LevelBarProps {
  name: any;
  init: number;
  life: number;
  classe?: string;
}

const LevelBar: FunctionComponent<LevelBarProps> = ({
  name,
  init,
  life,
  classe,
}) => {
  const lifePercentage = (life / 200) * 100;
  console.log('life', life);
  const progressBarColor =
    lifePercentage < 50 ? styles.progressRed : styles.progressGreem;
  console.log('progressBarColor', progressBarColor);
  return (
    <div className={`${styles.levelbar}`}>
      <div className={styles.levelindicator}>
        <b className={styles.beeLife}>{name}</b>
        <b className={styles.beeLife}>{life}</b>
      </div>
      <div className={`${styles.progresbar} ${classe || ''}`}>
        <div
          className={`${styles.progress}  ${progressBarColor || ''}`}
          style={{
            width: `${lifePercentage}%`,
          }}
        >
          <div className={styles.start} />
          <div className={styles.start} />
        </div>
      </div>
    </div>
  );
};

export default LevelBar;
