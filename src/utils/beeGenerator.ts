import { v4 as uuidv4 } from 'uuid';
import { ABILITIES, Ability } from './abilitiesData';

export type BeePieceType = 'Water' | 'Fire' | 'Earth' | 'Air' | 'Phantom' | 'Poison' | 'Metal' | 'Gem';
export type StatName = 'Health' | 'Speed' | 'Attack' | 'Defense';

export interface Stat {
  name: StatName;
  value: number;
}

export interface BeePiece {
  userId?: any;
  idPart: string;
  namePart: string;
  typePart: BeePieceType;
  stats: Stat[];
  ability: Ability;
  isAssigned: boolean; // Indica si la parte está asignada a una abeja o libre
  isForSale: boolean;  // Indica si la parte está en venta
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

export const generateRandomAbility = (typePart: BeePieceType): Ability => {
  // Filtrar habilidades del tipo específico y tipo "(ALL)"
  const allAbilities = ABILITIES.filter(ability => ability.Parts === '(ALL)');
  const typeSpecificAbilities = ABILITIES.filter(ability => ability.Parts === typePart);

  // Contar cuántas habilidades hay en cada conjunto
  const totalAllAbilities = allAbilities.length;
  const totalTypeSpecificAbilities = typeSpecificAbilities.length;

  // Calcular el peso o porcentaje para habilidades "(ALL)"
  const allWeight = totalAllAbilities / (totalAllAbilities + totalTypeSpecificAbilities);
  const typeWeight = totalTypeSpecificAbilities / (totalAllAbilities + totalTypeSpecificAbilities);

  // Generar un número aleatorio para decidir entre "(ALL)" o habilidades específicas del tipo
  const randomValue = Math.random();

  let selectedAbility;
  if (randomValue < allWeight) {
    // Selecciona una habilidad "(ALL)"
    selectedAbility = allAbilities[Math.floor(Math.random() * totalAllAbilities)];
  } else {
    // Selecciona una habilidad específica del tipo
    selectedAbility = typeSpecificAbilities[Math.floor(Math.random() * totalTypeSpecificAbilities)];
  }

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
    isAssigned: false,
    isForSale: false,
  };
};

export const collectPowers = (parts: BeePiece[]): Power[] => {
  return parts.map(part => ({
    partName: part.namePart,
    abilityName: part.ability.name,
    typePart: part.typePart,
  }));
};
export const collectStats = (parts: BeePiece[]): Record<StatName, number> => {
  const initialStats: Record<StatName, number> = {
    Health: 0,
    Speed: 0,
    Attack: 0,
    Defense: 0,
  };

  parts.forEach(part => {
    part.stats.forEach(stat => {
      initialStats[stat.name] += stat.value;
    });
  });

  return initialStats;
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
