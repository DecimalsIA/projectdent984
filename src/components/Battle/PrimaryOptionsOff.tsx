import { FunctionComponent } from 'react';
import styles from './PrimaryOptionsOff.module.css';
import Image from 'next/image';

interface PrimaryOptionsOffProps {
  timeLeft: number;
  life: number;
  type: any;
}

const PrimaryOptionsOff: FunctionComponent<PrimaryOptionsOffProps> = ({
  timeLeft,
  life,
  type,
}) => {
  const lifePercentage = (life / 500) * 100;
  console.log('--->life', life);
  return (
    <div className={styles.primaryoptions}>
      <div className={styles.beestats}>
        <div className={styles.extraoptionscontainer}>
          <div className={styles.userinfocontainer}>
            <Image
              className={styles.boldNatureTravelBee}
              alt=""
              width={20}
              height={20}
              src="/assets/Bee.png"
            />
            <div className={styles.beenametext}>Opponent | {type}</div>
          </div>
        </div>
        {/*   <div className={styles.levelbar}>
          <div className={styles.levelindicator}>
            <b className={styles.beeLife}>BEE LIFE</b>
            <b className={styles.beeLife}>{life} - 500</b>
          </div>
          <div className={styles.progresbar}>
            <div
              className={styles.progress}
              style={{ width: `${lifePercentage}%` }}
            >
              <div className={styles.start} />
              <div className={styles.start} />
            </div>
          </div> 
        </div>*/}
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
              <Image
                className={styles.icon}
                width={20}
                height={20}
                alt=""
                src="/assets/attack.svg"
              />
              <div className={styles.label}>attack</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryOptionsOff;
