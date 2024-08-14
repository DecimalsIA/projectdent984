// api/mi-enpoint/route.ts

import { NextResponse } from 'next/server';

type BeePieceType = 'Water' | 'Fire' | 'Earth' | 'Air' | 'Phantom' | 'Poison' | 'Metal' | 'Gem';
type Stat = { name: string; value: number };
type Ability = { name: string; description: string };

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
}

const PIECE_TYPES: BeePieceType[] = ['Water', 'Fire', 'Earth', 'Air', 'Phantom', 'Poison', 'Metal', 'Gem'];

// Función para generar un número aleatorio con distribución normal
const generateGaussianRandom = (mean: number, stdDev: number): number => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num * stdDev + mean;
  if (num > 0) return Math.min(Math.floor(num), 100); // Ensure within range
  return 0;
};

const generateRandomStat = (): Stat => {
  // Estadísticas más probables alrededor de 50 con desvío estándar de 15
  return {
    name: 'Power',
    value: generateGaussianRandom(50, 15),
  };
};

const generateRandomAbility = (): Ability => {
  // Habilidades más comunes con efectos variados
  const abilities = [
    { name: 'Flame Burst', description: 'Deals high fire damage.' },
    { name: 'Aqua Shield', description: 'Increases defense against water attacks.' },
    { name: 'Stone Skin', description: 'Reduces physical damage received.' },
    { name: 'Wind Fury', description: 'Increases attack speed significantly.' },
    { name: 'Phantom Strike', description: 'Delivers a powerful ethereal attack.' },
    { name: 'Toxic Sting', description: 'Poisons the target, dealing damage over time.' },
    { name: 'Metal Armor', description: 'Boosts defense significantly.' },
    { name: 'Gem Shine', description: 'Heals a small amount of health each turn.' },
  ];
  return abilities[Math.floor(Math.random() * abilities.length)];
};

const generateRandomBeePiece = (): BeePiece => ({
  type: PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)],
  stats: [generateRandomStat()],
  ability: generateRandomAbility(),
});

const generateRandomBee = (): Bee => ({
  head: generateRandomBeePiece(),
  torso: generateRandomBeePiece(),
  stinger: generateRandomBeePiece(),
  hindLegs: generateRandomBeePiece(),
  frontLegs: generateRandomBeePiece(),
  wings: generateRandomBeePiece(),
});

export async function POST() {
  const randomBee = generateRandomBee();

  return NextResponse.json({ bee: randomBee });
}
