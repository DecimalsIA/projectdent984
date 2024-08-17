/* eslint-disable @next/next/no-img-element */
import { FunctionComponent } from 'react';
import styles from './BeePartsCategory.module.css';

interface BeePart {
  name: string;
  image: string;
  icon: string;
  title?: string;
}

interface Category {
  title: string;
  parts: any[];
  link: string;
}

interface BeePartsCategoryProps {
  category: Category;
  onCategoryClick?: () => void; // Callback for category click
  onPartClick?: (part: any, index: any) => void; // Callback for part click
}

const BeePartsCategory: FunctionComponent<BeePartsCategoryProps> = ({
  category,
  onCategoryClick,
  onPartClick,
}) => {
  return (
    <div className={styles.beepartscategory}>
      <div
        className={styles.beepartcategory}
        onClick={onCategoryClick} // Category click handler
      >
        <div className={styles.badgetext}>{category.title}</div>
        <img
          className={styles.boldArrowsAltArrowRigh}
          alt={category.title}
          src="/assets/bee-characters/icons/arowr.svg"
        />
      </div>
      <div className={styles.carrusel}>
        {category.parts.map((part, index) => (
          <div
            key={index}
            className={styles.cardbeepart}
            onClick={() => onPartClick?.(part, index)} // Part click handler
          >
            <div className="beecardImage">
              <img
                className={styles.beeimageIcon}
                alt={part.name}
                src={part.image}
              />
            </div>
            <div className={styles.beepartname}>
              <img
                className={styles.fire11Icon}
                alt={part.name}
                src={part.icon}
              />
              <div className={styles.badgetext}>{part.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BeePartsCategory;
