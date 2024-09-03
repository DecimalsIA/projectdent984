import { FunctionComponent, useState, useCallback } from 'react';
import styles from './FilterBody.module.css';
import Image from 'next/image';
import { Select, SelectItem, Selection } from '@nextui-org/react';

const FilterBody: FunctionComponent = () => {
  const [isStatOpen, setIsStatOpen] = useState(false);
  const [values, setValues] = useState<Selection>(new Set(['cat', 'dog']));

  const [abilitySuggestions] = useState<string[]>([
    'Frenzy',
    'Focus',
    'Fortify',
  ]);
  const [selectedAbility, setSelectedAbility] = useState('');

  const onCloseIconClick = useCallback(() => {
    setIsStatOpen(!isStatOpen);
  }, [isStatOpen]);

  const onAbilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAbility(e.target.value);
  };
  const animals = [
    { key: 'cat', label: 'Cat' },
    { key: 'dog', label: 'Dog' },
    { key: 'elephant', label: 'Elephant' },
    { key: 'lion', label: 'Lion' },
    { key: 'tiger', label: 'Tiger' },
    { key: 'giraffe', label: 'Giraffe' },
    { key: 'dolphin', label: 'Dolphin' },
    { key: 'penguin', label: 'Penguin' },
    { key: 'zebra', label: 'Zebra' },
    { key: 'shark', label: 'Shark' },
    { key: 'whale', label: 'Whale' },
    { key: 'otter', label: 'Otter' },
    { key: 'crocodile', label: 'Crocodile' },
  ];

  return (
    <div className={styles.content}>
      <div className={styles.typefiltercontainer}>
        <div className={styles.text}>Type of item</div>
        <div className={styles.list}>
          <div className={styles.badge}>
            <div className={styles.badgetext}>Normal</div>
          </div>
          <div className={styles.badge1}>
            <Image
              src="/assets/stars.svg"
              width={18}
              height={18}
              alt="Stars icon"
              unoptimized
              className={styles.boldAstronomyStars}
            />
            <div className={styles.badgetext}>Shiny</div>
          </div>
        </div>
      </div>
      <div className={styles.statfiltercontainer} onClick={onCloseIconClick}>
        <div className={styles.titlecontainer}>
          <div className={styles.text}>Specific stat</div>
          <Image
            src="/assets/arrowDown.svg"
            width={24}
            height={24}
            alt="Arrow down icon"
            unoptimized
            className={
              isStatOpen
                ? styles.boldArrowsAltArrowDown + ' ' + styles.active
                : styles.boldArrowsAltArrowDown
            }
          />
        </div>
      </div>
      {isStatOpen && (
        <div className={styles.accordionContent}>
          <div className={styles.statItem}>
            <Image
              src="/assets/shield.svg"
              width={24}
              height={24}
              alt="Defense icon"
              unoptimized
            />
            <span>Defense</span>
            <input
              type="text"
              placeholder="5-15"
              className={styles.inputField}
            />
          </div>
          <div className={styles.statItem}>
            <Image
              src="/assets/speed.svg"
              width={24}
              height={24}
              alt="Speed icon"
              unoptimized
            />
            <span>Speed</span>
            <input
              type="text"
              placeholder="1-10"
              className={styles.inputField}
            />
          </div>
          <div className={styles.statItem}>
            <Image
              src="/assets/attack.svg"
              width={24}
              height={24}
              alt="Attack icon"
              unoptimized
            />
            <span>Attack</span>
            <input
              type="text"
              placeholder="10-30"
              className={styles.inputField}
            />
          </div>
          <div className={styles.statItem}>
            <Image
              src="/assets/health.svg"
              width={24}
              height={24}
              alt="Health icon"
              unoptimized
            />
            <span>Health</span>
            <input
              type="text"
              placeholder="10-30"
              className={styles.inputField}
            />
          </div>
        </div>
      )}
      <div className={styles.typefiltercontainer}>
        <div className={styles.text}>Ability</div>
        <div className={styles.form}>
          <Image
            src="/assets/sword.svg"
            width={18}
            height={18}
            alt="Sword icon"
            unoptimized
            className={styles.boldAstronomyStars}
          />
          <Select
            label=""
            selectionMode="multiple"
            placeholder="Select an ability..."
            radius="none"
            selectedKeys={values}
            labelPlacement="outside"
            className="max-w-xs"
            onSelectionChange={setValues}
          >
            {animals.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className={styles.typefiltercontainer}>
        <div className={styles.text}>Type of bee</div>
        <div className={styles.form}>
          <Image
            src="/assets/Bee.svg"
            width={18}
            height={18}
            alt="Bee icon"
            unoptimized
            className={styles.boldAstronomyStars}
          />

          <select
            className={styles.selectField}
            value={selectedAbility}
            onChange={onAbilityChange}
          >
            <option value="" disabled>
              bee type...
            </option>
            {abilitySuggestions.map((ability, index) => (
              <option key={index} value={ability}>
                {ability}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.typefiltercontainer}>
        <div className={styles.text}>Part of bee</div>
        <div className={styles.form}>
          <Image
            src="/assets/Bee.svg"
            width={18}
            height={18}
            alt="Bee part icon"
            unoptimized
            className={styles.boldAstronomyStars}
          />

          <select
            className={styles.selectField}
            value={selectedAbility}
            onChange={onAbilityChange}
          >
            <option value="" disabled>
              bee part...
            </option>
            {abilitySuggestions.map((ability, index) => (
              <option key={index} value={ability}>
                {ability}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBody;
