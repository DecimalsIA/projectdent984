import Image from 'next/image';
import styles from './ExplorationCard.module.css';
import Countdown from './Countdown';
import TransactionComponent from './TransactionComponent';
import { ButtonPambii } from 'pambii-devtrader-front';
import { useRouter } from 'next/navigation';
interface ExplorationCardGameProps {
  dificultad: string;
  bee: string;
  payout: number;
  multiplier: string;
  timeLock?: any;
  updateAt?: any;
  data?: any;
}

const ExplorationCardGame: React.FC<ExplorationCardGameProps> = ({
  dificultad,
  bee,
  payout,
  multiplier,
  data,
  timeLock,
  updateAt,
}) => {
  const router = useRouter();
  console.log(timeLock);
  const endp: any = new Date();
  const statePay = timeLock - endp < 0 ? true : false;
  console.log(statePay);

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
        <div className={styles.name}>Currently under exploration</div>
        <div className={styles.name3}>
          Your selected bee is exploring this area, come back when the
          exploration time is over.
        </div>

        <div className={styles.badgeMinibuttonTooltip}>
          {!statePay ? (
            <div>
              <div className={styles.name4}>
                This bee will be available in{' '}
                <Countdown
                  stopCounting={false}
                  startTime={updateAt}
                  endTime={timeLock}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.name4}>Exploration Finish </div>
            </div>
          )}
          {statePay && (
            <div className={styles.name4}>Reward: {payout} PAMBII</div>
          )}
          {!multiplier && (
            <div className={styles.name4}>
              EXPLORING...{' '}
              <Countdown
                stopCounting={false}
                startTime={updateAt}
                endTime={timeLock}
              />
            </div>
          )}
          <div className={styles.boldFacesEmotionsSticke1} />
        </div>
        <hr />
        <div className={styles.name3}>
          You can buy another one from here or see which ones you have
          available.
        </div>

        <ButtonPambii
          color="white"
          bg="#196620"
          className="mb-2"
          onClick={() => router.push('/game/explore')}
          icon={
            <Image
              src="/assets/bee-characters/icons/explore-icon.svg"
              alt="Select arena"
              width={24}
              height={24}
            />
          }
        >
          {'New Exploration'}
        </ButtonPambii>
      </div>
    </div>
  );
};

export default ExplorationCardGame;
