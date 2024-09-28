import { FunctionComponent } from 'react';
import styles from './PrimaryOptionsOff.module.css';

interface PrimaryOptionsOffProps {
  timeLeft: number;
  dataBee: any;
}

const PrimaryOptionsOff: FunctionComponent<PrimaryOptionsOffProps> = ({
  timeLeft,
  dataBee,
}) => {
  return (
    <div className={styles.primaryoptions}>
      <div className={styles.beestats}>
        <div className={styles.extraoptionscontainer}>
          <div className={styles.userinfocontainer}>
            <img
              className={styles.boldNatureTravelBee}
              alt=""
              src="/assets/Bee.png"
            />
            <div className={styles.beenametext}>Opponent's</div>
          </div>
          <img
            className={styles.boldNatureTravelBee}
            alt=""
            src="Bold / Arrows / Alt Arrow Up.svg"
          />
        </div>
        <div className={styles.levelbar}>
          <div className={styles.levelindicator}>
            <b className={styles.beeLife}>BEE LIFE</b>
            <b className={styles.beeLife}>359 - 500</b>
          </div>
          <div className={styles.progresbar}>
            <div className={styles.progress}>
              <div className={styles.start} />
              <div className={styles.start} />
            </div>
          </div>
        </div>
        <div className={styles.buttonParent}>
          <div className={styles.button}>
            <div className={styles.box} />
            <div className={styles.box1}>
              <div className={styles.label}>{timeLeft} seconds</div>
            </div>
          </div>
          <div className={styles.button1}>
            <div className={styles.box2} />
            <div className={styles.box3}>
              <img className={styles.icon} alt="" src="/assets/attack.svg" />
              <div className={styles.label}>attack</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryOptionsOff;
