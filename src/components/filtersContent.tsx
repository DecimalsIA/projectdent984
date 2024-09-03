import { FunctionComponent, useState, useCallback } from 'react';
import styles from './FilterBody.module.css';
import Image from 'next/image';

const FilterBody: FunctionComponent = () => {
  const [isStatOpen, setIsStatOpen] = useState(false);
  const [abilitySuggestions, setAbilitySuggestions] = useState<string[]>([
    'Frenzy',
    'Focus',
    'Fortify',
  ]);
  const [abilityInput, setAbilityInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onCloseIconClick = useCallback(() => {
    setIsStatOpen(!isStatOpen);
  }, [isStatOpen]);

  const onAbilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAbilityInput(e.target.value);
  };

  const onAbilityClick = (ability: string) => {
    setAbilityInput(ability);
    setShowSuggestions(false); // Cierra las sugerencias después de seleccionar una
  };

  const onInputFocus = () => {
    setShowSuggestions(true);
  };

  const onInputBlur = () => {
    // Usar setTimeout para cerrar las sugerencias después de que se haga click en una sugerencia
    setTimeout(() => setShowSuggestions(false), 100);
  };

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
          <input
            type="text"
            placeholder="Write the ability..."
            className={styles.badgetext}
            value={abilityInput}
            onChange={onAbilityChange}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
          />
          {showSuggestions && (
            <div className={styles.suggestions}>
              {abilitySuggestions
                .filter((suggestion) =>
                  suggestion.toLowerCase().includes(abilityInput.toLowerCase()),
                )
                .map((suggestion, index) => (
                  <div
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => onAbilityClick(suggestion)}
                  >
                    <Image
                      src="/assets/sword.svg"
                      width={18}
                      height={18}
                      alt="Sword icon"
                      unoptimized
                    />
                    {suggestion}
                  </div>
                ))}
            </div>
          )}
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
          <input
            type="text"
            placeholder="bee type..."
            className={styles.badgetext}
          />
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
          <input
            type="text"
            placeholder="bee part..."
            className={styles.badgetext}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBody;
