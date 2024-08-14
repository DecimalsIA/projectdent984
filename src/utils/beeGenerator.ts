import { v4 as uuidv4 } from 'uuid';

export type BeePieceType = 'Water' | 'Fire' | 'Earth' | 'Air' | 'Phantom' | 'Poison' | 'Metal' | 'Gem';
export type StatName = 'Health' | 'Speed' | 'Attack' | 'Defense';

export interface Stat {
  name: StatName;
  value: number;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
}

export interface BeePiece {
  idPart: string;
  namePart: string;
  typePart: BeePieceType;
  stats: Stat[];
  ability: Ability;
  isAssigned: boolean;
  isForSale: boolean;  // Nuevo campo para indicar si la parte está en venta
  salePrice?: number;  // Precio de venta si la parte está en venta
}

export interface Power {
  partName: string;
  abilityName: string;
  typePart: BeePieceType;
}

export interface Bee {
  id: string;
  partIds: string[];
  type: BeePieceType;
}

const PIECE_TYPES: BeePieceType[] = ['Water', 'Fire', 'Earth', 'Air', 'Phantom', 'Poison', 'Metal', 'Gem'];

const STAT_RANGES: Record<StatName, [number, number]> = {
  Health: [10, 30],
  Speed: [1, 10],
  Attack: [10, 30],
  Defense: [5, 15],
};

const ABILITIES: Record<BeePieceType, Ability[]> = {
  Water: [{ id: uuidv4(), name: 'Aqua Shield', description: 'Increases defense against water attacks.' }],
  Fire: [{ id: uuidv4(), name: 'Flame Burst', description: 'Deals high fire damage.' }],
  Earth: [{ id: uuidv4(), name: 'Stone Skin', description: 'Reduces physical damage received.' }],
  Air: [{ id: uuidv4(), name: 'Wind Fury', description: 'Increases attack speed significantly.' }],
  Phantom: [{ id: uuidv4(), name: 'Phantom Strike', description: 'Delivers a powerful ethereal attack.' }],
  Poison: [{ id: uuidv4(), name: 'Toxic Sting', description: 'Poisons the target, dealing damage over time.' }],
  Metal: [{ id: uuidv4(), name: 'Metal Armor', description: 'Boosts defense significantly.' }],
  Gem: [{ id: uuidv4(), name: 'Gem Shine', description: 'Heals a small amount of health each turn.' }],
};

export const generateRandomStat = (statName: StatName): Stat => {
  const [min, max] = STAT_RANGES[statName];
  return {
    name: statName,
    value: Math.floor(Math.random() * (max - min + 1)) + min,
  };
};

export const generateRandomStats = (): Stat[] => {
  return ['Health', 'Speed', 'Attack', 'Defense'].map(statName => generateRandomStat(statName as StatName));
};

export const generateRandomAbility = (type: BeePieceType): Ability => {
  const abilities = ABILITIES[type];
  const selectedAbility = abilities[Math.floor(Math.random() * abilities.length)];
  return { ...selectedAbility, id: uuidv4() };
};

export const generateRandomBeePart = (namePart: string): BeePiece => {
  const idPart = uuidv4();
  const typePart = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return {
    idPart,
    namePart,
    typePart,
    stats: generateRandomStats(),
    ability: generateRandomAbility(typePart),
    isAssigned: false,  // Inicialmente, no asignado
    isForSale: false,   // Inicialmente, no en venta
  };
};

export const collectPowers = (parts: BeePiece[]): Power[] => {
  return parts.map(part => ({
    partName: part.namePart,
    abilityName: part.ability.name,
    typePart: part.typePart,
  }));
};

export const determineBeeType = (powers: Power[]): BeePieceType => {
  const typeCounts: Record<BeePieceType, number> = {
    Water: 0,
    Fire: 0,
    Earth: 0,
    Air: 0,
    Phantom: 0,
    Poison: 0,
    Metal: 0,
    Gem: 0,
  };

  powers.forEach(power => {
    typeCounts[power.typePart]++;
  });

  return Object.keys(typeCounts).reduce((a, b) => (typeCounts[a as BeePieceType] > typeCounts[b as BeePieceType] ? a : b)) as BeePieceType;
};
