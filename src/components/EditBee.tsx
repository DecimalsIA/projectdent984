import { FunctionComponent, useCallback } from 'react';
import styles from './EditBee.module.css';
import { PencilIcon } from 'pambii-devtrader-front';
import Bee from './Bee';

type BeePart = {
  imageSrc: string;
  name: string;
  description: string;
  badgeIconSrc: string;
  badgeText: string;
};

type BeeStat = {
  iconSrc: string;
  value: number;
};

type BeeData = {
  name: string;
  imageSrc: string;
  parts: any[];
  stats: BeeStat[];
};

interface EditBeeProps {
  beeData: BeeData;
  onViewInfo: (part: BeePart) => void;
  onChangePart: (part: BeePart) => void;
  onChangeName: (name: string) => void;
}

const EditBee: FunctionComponent<EditBeeProps> = ({
  beeData,
  onViewInfo,
  onChangePart,
  onChangeName,
}) => {
  const partsByKey = beeData?.parts?.reduce((acc, part) => {
    acc[part.name] = part;
    return acc;
  }, {});

  return (
    <div className={styles.bodycontainer}>
      <div className={styles.beecardedit}>
        <div
          className={styles.editname}
          onClick={() => onChangeName(beeData.name)}
        >
          <PencilIcon />
          <div className={styles.name}>{beeData.name}</div>
        </div>
        <div className={styles.beecontainer}>
          <Bee
            basePathW={partsByKey?.['WINGS']?.badgeText?.toLowerCase() || ''}
            basePathH={partsByKey?.['HEAD']?.badgeText?.toLowerCase() || ''}
            basePathF={
              partsByKey?.['FRONTLEGS']?.badgeText?.toLowerCase() || ''
            }
            basePathHi={
              partsByKey?.['HINDLEGS']?.badgeText?.toLowerCase() || ''
            }
            basePathSt={partsByKey?.['STINGER']?.badgeText?.toLowerCase() || ''}
            basePathT={partsByKey?.['TORSO']?.badgeText?.toLowerCase() || ''}
          />
        </div>
        {beeData.stats.length > 0 && (
          <div className={styles.powerratecontainer}>
            <div className={styles.text}>Power rate of this bee</div>
            <div className={styles.badges}>
              {beeData.stats.map((stat, index) => (
                <div className={styles.badge} key={index}>
                  <img
                    className={styles.boldSecurityBombMinimal}
                    alt=""
                    src={stat.iconSrc}
                  />
                  <div className={styles.badgetext}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.powerratecontainer}>
          <div className={styles.text}>Parts of the bee</div>
          {beeData.parts.map((part, index) => (
            <div className={styles.beepart} key={index}>
              <div className={styles.generalinfo}>
                <div className={styles.image}>
                  <img
                    className={styles.cabezaveneno1Icon}
                    alt=""
                    src={part.imageSrc}
                  />
                </div>
                <div className={styles.nameandtype}>
                  <div className={styles.text}>{part.name}</div>
                  <div className={styles.text2}>{part.description}</div>
                  <div className={styles.badge5}>
                    <img
                      className={styles.boldSecurityBombMinimal}
                      alt=""
                      src={part.badgeIconSrc}
                    />
                    <div className={styles.badgetext}>{part.badgeText}</div>
                  </div>
                </div>
              </div>
              <div className={styles.buttons}>
                <div className={styles.button} onClick={() => onViewInfo(part)}>
                  <div className={styles.box} />
                  <div className={styles.box1}>
                    <div className={styles.label}>View info</div>
                  </div>
                </div>
                <div
                  className={styles.button1}
                  onClick={() => onChangePart(part)}
                >
                  <div className={styles.box2} />
                  <div className={styles.box1}>
                    <div className={styles.label}>Change</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditBee;
