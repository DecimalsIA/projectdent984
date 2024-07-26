import Image from 'next/image';
import styles from './ExplorationCard.module.css';
interface ExplorationCardGameProps {}

const ExplorationCardGame: React.FC<ExplorationCardGameProps> = () => {
  return (
    <div className={styles.explorationcard}>
      <div className={styles.nameParent}>
        <div className={styles.name}>EXPLORATION</div>
        <div className={styles.name1}>1,054,352 Pooled PAMBII</div>
      </div>
      <div className={styles.selectbeecontainer}>
        <Image
          src="/panal_animado.gif"
          width={120}
          height={120}
          alt="Picture of the author"
          className={styles.prueba11Icon}
          unoptimized
        />
      </div>
      <div className={styles.badge}>
        <Image
          src="/panal_animado.gif"
          width={120}
          height={120}
          alt="Picture of the author"
          className={styles.boldFacesEmotionsSticke}
          unoptimized
        />
        <div className={styles.badgetext}>HARD</div>
      </div>
      <div className={styles.fuego1Parent}>
        <Image
          src="/panal_animado.gif"
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
            src="/panal_animado.gif"
            width={120}
            height={120}
            alt="Picture of the author"
            className={styles.boldTimeWatchRound}
            unoptimized
          />

          <div className={styles.name4}>The exploration ends at: 3:23:54</div>
          <div className={styles.boldFacesEmotionsSticke1} />
        </div>
      </div>
    </div>
  );
};

export default ExplorationCardGame;
