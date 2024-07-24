// BeePartsCarousel.tsx
import React, { useState } from 'react';
import BeePartsComponent from './BeeParts';

interface BeePart {
  name: string;
  image: string;
}

interface BeePartsCarouselProps {
  title: string;
  link: string;
  parts: BeePart[];
}

const BeePartsCarousel: React.FC<BeePartsCarouselProps> = ({
  parts,
  link,
  title,
}) => {
  return (
    <div className="beepartscategory-carousel">
      <div className="beepartcategory-carousel">
        {title && (
          <a href={link} className="badgetext-carousel">
            <div> {title}</div>
            <div></div>
          </a>
        )}
      </div>
      <div className="flex">
        <BeePartsComponent partsData={parts} />
      </div>
    </div>
  );
};

export default BeePartsCarousel;
