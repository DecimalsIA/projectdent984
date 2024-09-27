import { FunctionComponent } from 'react';
import styles from './PrimaryOptionsOn.module.css';

interface PrimaryOptionsOnProps {
  timeLeft: number;
}

const PrimaryOptionsOn: FunctionComponent<PrimaryOptionsOnProps> = ({
  timeLeft,
}) => {
  return (
    <div className={styles.primaryoptions}>
      <div className={styles.beestats}>
        <div className={styles.extraoptionscontainer}>
          <div className={styles.userinfocontainer}>
            <img
              className={styles.boldNatureTravelBee}
              alt=""
              src="Bold / Nature, Travel / Bee.svg"
            />
            <div className={styles.beenametext}>PRINCESA MONSTRUO</div>
          </div>
          <img
            className={styles.boldNatureTravelBee}
            alt=""
            src="Bold / Arrows / Alt Arrow Down.svg"
          />
        </div>
        <div className={styles.badges}>
          <div className={styles.badge}>
            <img
              className={styles.boldSecurityBombMinimal}
              alt=""
              src="Bold / Security / Bomb Minimalistic.svg"
            />
            <div className={styles.badgetext}>250</div>
          </div>
          <div className={styles.badge}>
            <img
              className={styles.boldLikeHeart}
              alt=""
              src="Bold / Like / Heart .svg"
            />
            <div className={styles.badgetext}>250</div>
          </div>
          <div className={styles.badge}>
            <img
              className={styles.boldSecurityBombMinimal}
              alt=""
              src="Bold / Essentional, UI / Bolt.svg"
            />
            <div className={styles.badgetext}>250</div>
          </div>
          <div className={styles.badge}>
            <img
              className={styles.boldSecurityBombMinimal}
              alt=""
              src="Bold / Essentional, UI / Sword.svg"
            />
            <div className={styles.badgetext}>250</div>
          </div>
          <div className={styles.badge}>
            <img
              className={styles.boldSecurityBombMinimal}
              alt=""
              src="Bold / Security / Shield Minimalistic.svg"
            />
            <div className={styles.badgetext}>250</div>
          </div>
        </div>
        <div className={styles.abilitiescontainer}>
          <b className={styles.beenametext1}>Abilities of this bee:</b>
          <div className={styles.abilitiescontainer1}>
            <div className={styles.abilities}>
              <div className={styles.badge5}>
                <img
                  className={styles.boldEssentionalUiSledg}
                  alt=""
                  src="Bold / Essentional, UI / Sledgehammer.svg"
                />
                <div className={styles.badgetext}>Ability 1</div>
              </div>
              <div className={styles.badge6}>
                <img
                  className={styles.boldEssentionalUiSledg}
                  alt=""
                  src="Bold / Nature, Travel / Fire.svg"
                />
                <div className={styles.badgetext}>Ability 2</div>
              </div>
            </div>
            <div className={styles.abilities}>
              <div className={styles.badge6}>
                <img
                  className={styles.boldEssentionalUiSledg}
                  alt=""
                  src="Bold / Nature, Travel / Fire.svg"
                />
                <div className={styles.badgetext}>Ability 3</div>
              </div>
              <div className={styles.badge6}>
                <img
                  className={styles.boldEssentionalUiSledg}
                  alt=""
                  src="Bold / Essentional, UI / Ghost.svg"
                />
                <div className={styles.badgetext}>Ability 4</div>
              </div>
            </div>
            <div className={styles.abilities2}>
              <div className={styles.badge6}>
                <img
                  className={styles.boldEssentionalUiSledg}
                  alt=""
                  src="Bold / Food, Kitchen / Bottle.svg"
                />
                <div className={styles.badgetext}>Ability 5</div>
              </div>
            </div>
          </div>
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
        <div className={styles.buttons}>
          <div className={styles.navbutton}>
            <div className={styles.text}>HEAL 20% HP (2-2)</div>
            <div className={styles.button}>
              <div className={styles.box} />
              <div className={styles.box1}>
                <img className={styles.icon} alt="" src="Icon.svg" />
                <div className={styles.label}>457</div>
              </div>
            </div>
          </div>
          <div className={styles.navbutton}>
            <div className={styles.text}>Doble attack (1-1)</div>
            <div className={styles.button1}>
              <div className={styles.box2} />
              <div className={styles.box1}>
                <img className={styles.icon1} alt="" src="Icon.svg" />
                <div className={styles.label}>457</div>
              </div>
            </div>
          </div>
          <div className={styles.navbutton}>
            <div className={styles.text}>INC. DEF 100% (2-2)</div>
            <div className={styles.button2}>
              <div className={styles.box4} />
              <div className={styles.box1}>
                <img className={styles.icon} alt="" src="Icon.svg" />
                <div className={styles.label}>457</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonParent}>
          <div className={styles.button3}>
            <div className={styles.box6} />
            <div className={styles.box7}>
              <div className={styles.label}>{timeLeft} seconds</div>
            </div>
          </div>
          <div className={styles.button4}>
            <div className={styles.box8} />
            <div className={styles.box1}>
              <img className={styles.icon} alt="" src="Icon.svg" />
              <div className={styles.label}>attack</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryOptionsOn;
