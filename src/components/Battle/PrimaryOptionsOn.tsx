import { FunctionComponent, useState } from 'react';
import styles from './PrimaryOptionsOn.module.css';
import Image from 'next/image';

interface PrimaryOptionsOnProps {
  timeLeft: number;
  dataBee: any; // Ajustar el tipo según sea necesario
  onAttack: (selectedAbility: any) => void; // Nueva prop para manejar el ataque
  life: any;
}

const PrimaryOptionsOn: FunctionComponent<PrimaryOptionsOnProps> = ({
  timeLeft,
  dataBee,
  onAttack,
  life,
}) => {
  interface Ability {
    id: number;
    name: string;
    type_habilities: string;
  }

  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

  const handleSelectAbility = (ability: any) => {
    setSelectedAbility(ability); // Almacenar la habilidad seleccionada
    console.log('ability', ability);
  };

  const handleAttackClick = () => {
    if (selectedAbility) {
      onAttack(selectedAbility); // Llama a la función onAttack con la habilidad seleccionada
    } else {
      console.log('No ability selected');
    }
  };
  const lifePercentage = (life / 500) * 100;
  return (
    <div className={styles.primaryoptions}>
      <div className={styles.beestats}>
        <div className={styles.extraoptionscontainer}>
          <div className={styles.userinfocontainer}>
            <Image
              className={styles.boldNatureTravelBee}
              alt="boldNatureTravelBee"
              width={20}
              height={20}
              src="/assets/Bee.png"
            />
            <div className={styles.beenametext}>{dataBee.title}</div>
          </div>
          <Image
            className={styles.boldNatureTravelBee}
            alt="boldNatureTravelBee"
            width={20}
            height={20}
            src="/assets/arrowDown.svg"
          />
        </div>
        {dataBee?.power && dataBee.power.length > 0 ? (
          <div className={styles.badges}>
            {dataBee.power.map((dpower: any, index: any) => (
              <div className={styles.badge} key={index}>
                <Image
                  src={'/assets/bee-characters/icons/' + dpower.name + '.svg'}
                  alt={dpower.name}
                  width={20}
                  height={20}
                  id={index.toString()}
                />
                <div className={styles.badgetext}>{dpower.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No power data available</p>
        )}
        <div className={styles.abilitiescontainer}>
          <b className={styles.beenametext1}>Abilities of this bee:</b>
          {dataBee?.abilitiesData && dataBee.abilitiesData.length > 0 ? (
            <div className={styles.abilitiesGrid}>
              {dataBee.abilitiesData.map((ability: any, index: any) => (
                <div
                  key={index}
                  className={`${styles.abilityItem} ${
                    selectedAbility?.id === ability.id ? styles.selected : ''
                  }`}
                  onClick={() => handleSelectAbility(ability)}
                >
                  <div className={styles.badge + ' h-33px'}>
                    <div className={styles.badgetext}>{ability.name}</div> |
                    <div className={styles.badgetext}>
                      {ability.type_habilities}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
        <div className={styles.levelbar}>
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
        </div>
        <div className={styles.buttons}>
          <div className={styles.navbutton}>
            <div className={styles.text}>HEAL 20% HP (2-2)</div>
            <div className={styles.button}>
              <div className={styles.box} />
              <div className={styles.box1}>
                <img
                  className={styles.icon}
                  alt=""
                  width={20}
                  height={20}
                  src="/assets/healhp.svg"
                />
                <div className={styles.label}>457</div>
              </div>
            </div>
          </div>
          <div className={styles.navbutton}>
            <div className={styles.text}>Doble attack (1-1)</div>
            <div className={styles.button1}>
              <div className={styles.box2} />
              <div className={styles.box1}>
                <img
                  className={styles.icon1}
                  alt=""
                  src="/assets/dattack.svg"
                />
                <div className={styles.label}>457</div>
              </div>
            </div>
          </div>
          <div className={styles.navbutton}>
            <div className={styles.text}>INC. DEF 100% (2-2)</div>
            <div className={styles.button2}>
              <div className={styles.box4} />
              <div className={styles.box1}>
                <Image
                  className={styles.icon}
                  alt=""
                  width={20}
                  height={20}
                  src="/assets/incdef.svg"
                />
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
          <div className={styles.button4} onClick={handleAttackClick}>
            <div className={styles.box8} />
            <div className={styles.box1}>
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

export default PrimaryOptionsOn;
