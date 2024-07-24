// BeePartsComponent.tsx
import Image from 'next/image';
import React from 'react';
import './BeePartsComponent.css';
// Define una interfaz para los datos de las partes
interface BeePart {
  image?: string;
  icon?: string;
  name?: string;
}

// Define las props que recibirá el componente
interface BeePartsComponentProps {
  partsData: BeePart[];
  title?: boolean;
}
const BeePartsComponent: React.FC<BeePartsComponentProps> = ({
  partsData,
  title,
}) => {
  return (
    <div className="beeparts-bodycontainer">
      <div className="beeparts-bodyinventory">
        <div className="beeparts-beepartscategory">
          {title && (
            <div className="beeparts-beepartcategory flex flex-row">
              <div className="beeparts-badgetext">
                Special bee parts for today
              </div>
              <div className="beeparts-badgetext1">
                <p className="beeparts-these-special-parts">
                  These special parts expire on:
                </p>
                <p className="beeparts-p">18:56:13</p>
              </div>
            </div>
          )}
          <div className="flex flex-row flex-wrap gap-4 justify-center">
            {partsData.map((part, index) => (
              <div key={index} className="beeparts-carrusel">
                <div className="beeparts-cardbeepart">
                  <div className="beeparts-beepartcontainer">
                    {part.image && (
                      <Image
                        src={part.image}
                        alt="Select arena"
                        width={100}
                        height={100}
                      />
                    )}
                  </div>
                  <div className="beeparts-beepartname">
                    {part.icon && (
                      <Image
                        src={part.icon}
                        alt="Select arena"
                        width={18}
                        height={18}
                        className="beeparts-fire-1-1-icon"
                      />
                    )}
                    <div className="beeparts-badgetext2">{part.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeePartsComponent;
