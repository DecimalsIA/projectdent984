import Image from 'next/image';
import styles from './ExplorationCard.module.css';
import Countdown from './Countdown';
interface ExplorationCardGameProps {
  dificultad: string;
  bee: string;
  payout: number;
  multiplier: string;
}

const ExplorationCardGame: React.FC<ExplorationCardGameProps> = ({
  dificultad,
  bee,
  payout,
  multiplier,
}) => {
  return (
    <div className={styles.explorationcard}>
      <div className={styles.nameParent}>
        <div className={styles.name}>EXPLORATION</div>
        <div className={styles.name1}>1,054,352 Pooled PAMBII</div>
      </div>
      <div className={styles.selectbeecontainer}>
        <Image
          src={'/assets/bee-characters/arena/' + dificultad + '.png'}
          width={120}
          height={120}
          alt="Picture of the author"
          className={styles.prueba11Icon}
          unoptimized
        />
      </div>
      <div className={styles.badge}>
        <Image
          src={'/assets/bee-characters/icons/' + dificultad + '.svg'}
          width={120}
          height={120}
          alt="Picture of the author"
          className={styles.boldFacesEmotionsSticke}
          unoptimized
        />
        <div className={styles.badgetext}>{dificultad}</div>
      </div>
      <div className={styles.fuego1Parent}>
        <Image
          src={'/assets/bee-characters/' + bee + '.png'}
          width={120}
          height={120}
          alt="Picture of the author"
          className={styles.fuego1Icon}
          unoptimized
        />
        <div className={styles.name}>Currently under exploration</div>
        <div className={styles.name3}>
          Your selected bee is exploring this area, come back when the
          exploration time is over.
        </div>
        <div className={styles.badgeMinibuttonTooltip}>
          <Image
            src={'/assets/bee-characters/icons/' + dificultad + '.svg'}
            width={120}
            height={120}
            alt="Picture of the author"
            className={styles.boldTimeWatchRound}
            unoptimized
          />

          {multiplier && (
            <div className={styles.name4}>
              Exploration Reward: {payout} PAMBII
            </div>
          )}
          {!multiplier && (
            <div className={styles.name4}>
              EXPLORING... <Countdown stopCounting={false} />
            </div>
          )}
          <div className={styles.boldFacesEmotionsSticke1} />
        </div>
      </div>
    </div>
  );
};

export default ExplorationCardGame;
