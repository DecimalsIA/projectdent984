// api/mi-enpoint/route.ts

import { NextResponse } from 'next/server';

type BeePieceType = 'Water' | 'Fire' | 'Earth' | 'Air' | 'Phantom' | 'Poison' | 'Metal' | 'Gem';

type StatName = 'Health' | 'Speed' | 'Attack' | 'Defense';

interface Stat {
  name: StatName;
  value: number;
}

interface Ability {
  name: string;
  description: string;
}

interface BeePiece {
  type: BeePieceType;
  stats: Stat[];
  ability: Ability;
}

interface Bee {
  head: BeePiece;
  torso: BeePiece;
  stinger: BeePiece;
  hindLegs: BeePiece;
  frontLegs: BeePiece;
  wings: BeePiece;
  totalStats: Record<StatName, number>;
}

const PIECE_TYPES: BeePieceType[] = ['Water', 'Fire', 'Earth', 'Air', 'Phantom', 'Poison', 'Metal', 'Gem'];

const STAT_RANGES: Record<StatName, [number, number]> = {
  Health: [10, 30],
  Speed: [1, 10],
  Attack: [10, 30],
  Defense: [5, 15],
};

const ABILITIES: Record<BeePieceType, Ability[]> = {
  Water: [{ name: 'Aqua Shield', description: 'Increases defense against water attacks.' }],
  Fire: [{ name: 'Flame Burst', description: 'Deals high fire damage.' }],
  Earth: [{ name: 'Stone Skin', description: 'Reduces physical damage received.' }],
  Air: [{ name: 'Wind Fury', description: 'Increases attack speed significantly.' }],
  Phantom: [{ name: 'Phantom Strike', description: 'Delivers a powerful ethereal attack.' }],
  Poison: [{ name: 'Toxic Sting', description: 'Poisons the target, dealing damage over time.' }],
  Metal: [{ name: 'Metal Armor', description: 'Boosts defense significantly.' }],
  Gem: [{ name: 'Gem Shine', description: 'Heals a small amount of health each turn.' }],
};

const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomStat = (statName: StatName): Stat => {
  const [min, max] = STAT_RANGES[statName];
  return {
    name: statName,
    value: getRandomInRange(min, max),
  };
};

const generateRandomStats = (): Stat[] => {
  return ['Health', 'Speed', 'Attack', 'Defense'].map(statName => generateRandomStat(statName as StatName));
};

const generateRandomAbility = (type: BeePieceType): Ability => {
  const abilities = ABILITIES[type];
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const generateRandomBeePiece = (): BeePiece => {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return {
    type,
    stats: generateRandomStats(),
    ability: generateRandomAbility(type),
  };
};

const calculateTotalStats = (bee: Bee): Record<StatName, number> => {
  const totalStats: Record<StatName, number> = {
    Health: 0,
    Speed: 0,
    Attack: 0,
    Defense: 0,
  };

  const beePieces = [bee.head, bee.torso, bee.stinger, bee.hindLegs, bee.frontLegs, bee.wings];

  beePieces.forEach(piece => {
    piece.stats.forEach(stat => {
      totalStats[stat.name] += stat.value;
    });
  });

  return totalStats;
};

const generateRandomBee = (): Bee => {
  const bee = {
    head: generateRandomBeePiece(),
    torso: generateRandomBeePiece(),
    stinger: generateRandomBeePiece(),
    hindLegs: generateRandomBeePiece(),
    frontLegs: generateRandomBeePiece(),
    wings: generateRandomBeePiece(),
    totalStats: {} as Record<StatName, number>,
  };

  bee.totalStats = calculateTotalStats(bee);

  return bee;
};

export async function POST() {
  const randomBee = generateRandomBee();

  return NextResponse.json({ bee: randomBee });
}
