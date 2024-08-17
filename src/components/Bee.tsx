import React from 'react';
import './Bee.css';

interface BeeProps {
  basePathW: string;
  basePathH: string;
  basePathF: string;

  basePathHi: string;
  basePathSt: string;
  basePathT: string;
}

const Bee: React.FC<BeeProps> = ({
  basePathW,
  basePathH,
  basePathF,
  basePathHi,
  basePathSt,
  basePathT,
}) => {
  return (
    <div className="bee">
      <img
        src={`/assets/bee-characters/category/${basePathH}/parts/head.png`}
        className="part head"
        alt="head"
      />
      <img
        src={`/assets/bee-characters/category/${basePathT}/parts/torso.png`}
        className="part torso"
        alt="torso"
      />
      <img
        src={`/assets/bee-characters/category/${basePathF}/parts/frontlegs.png`}
        className="part frontlegs"
        alt="frontlegs"
      />
      <img
        src={`/assets/bee-characters/category/${basePathHi}/parts/hindlegs.png`}
        className="part hindlegs"
        alt="hindlegs"
      />
      <img
        src={`/assets/bee-characters/category/${basePathSt}/parts/stinger.png`}
        className="part stinger"
        alt="stinger"
      />
      <img
        src={`/assets/bee-characters/category/${basePathW}/parts/ala1Sup.png`}
        className="part ala1Sup"
        alt="ala1Sup"
      />
      <img
        src={`/assets/bee-characters/category/${basePathW}/parts/ala1Inf.png`}
        className="part ala1Inf"
        alt="ala1Inf"
      />
      <img
        src={`/assets/bee-characters/category/${basePathW}/parts/ala2Sup.png`}
        className="part ala2Sup"
        alt="ala2Sup"
      />
    </div>
  );
};

export default Bee;
