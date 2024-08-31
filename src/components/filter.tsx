import { FunctionComponent, useCallback } from 'react';
import styles from './filter.module.css';
import Image from 'next/image';

interface FilterProps {
  onClick: () => void;
}

const Filter: FunctionComponent<FilterProps> = ({ onClick }) => {
  return (
    <div className={styles.badge} onClick={onClick}>
      <Image
        src={'/assets/filter.svg'}
        width={120}
        height={120}
        alt="Picture of the author"
        className={styles.boldEssentionalUiFilte}
        unoptimized
      />
      <div className={styles.badgetext}>Add filters</div>
    </div>
  );
};

export default Filter;
