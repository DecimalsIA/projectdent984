import { NextResponse } from 'next/server';
const crypto = require('crypto');

// Obtener la variable de entorno para ajustar el porcentaje de ganadores
const WIN_RATIO = parseFloat(process.env.WIN_RATIO || '0.4'); // Por defecto, 40% ganan

type Experience = {
  exp: number;
  win: number;
  loss: number;
};

type PlayerResult = {
  player: number;
  mapNumber: number;
  multiplier: string;
  payout: number;
  experience: Experience;
};

function secureRandom(): number {
  const buffer = crypto.randomBytes(8);
  const high = buffer.readUInt32LE(4);
  const low = buffer.readUInt32LE(0);
  const combined = high * 0x100000000 + low;
  return combined / 0xffffffffffffffff;
}

function calculateExperience(multiplier: string, mapNumber: number): Experience {
  let exp = 0;
  let win = 0;
  let loss = 1;
  switch (mapNumber) {
    case 1:
      if (multiplier === 'x2' || multiplier === 'x1.5') {
        exp = 9850;
        win = 1;
      }
      break;
    case 2:
      if (multiplier === 'x4' || multiplier === 'x2') {
        exp = 12500;
        win = 1;
      }
      break;
    case 3:
      if (multiplier === 'x10' || multiplier === 'x5') {
        exp = 18500;
        win = 1;
      }
      break;
    default:
      exp = 0;
      win = 0;
      loss = 1;
      break;
  }
  return { exp, win, loss };
}

function calculateResult(mapNumber: number): string {
  const randomValue = secureRandom();
  const winThreshold = WIN_RATIO; // Variable de entorno para ajustar el porcentaje de ganadores
  const lossThreshold = 1 - winThreshold; // Porcentaje de perdedores

  if (mapNumber === 1) {
    if (randomValue <= winThreshold * 0.3) return 'x2'; // 30% de ganadores
    if (randomValue <= winThreshold * 0.6) return 'x1.5'; // 60% de ganadores
    if (randomValue <= lossThreshold * 0.2) return 'x1';
    if (randomValue <= lossThreshold * 0.4) return 'x0.75';
    if (randomValue <= lossThreshold * 0.8) return 'x0.5';
    return 'x0.7';
  } else if (mapNumber === 2) {
    if (randomValue <= winThreshold * 0.3) return 'x4';
    if (randomValue <= winThreshold * 0.6) return 'x2';
    if (randomValue <= lossThreshold * 0.2) return 'x1.5';
    if (randomValue <= lossThreshold * 0.4) return 'x1';
    if (randomValue <= lossThreshold * 0.8) return 'x0.5';
    return 'x0.7';
  } else if (mapNumber === 3) {
    if (randomValue <= winThreshold * 0.2) return 'x10';
    if (randomValue <= winThreshold * 0.4) return 'x5';
    if (randomValue <= lossThreshold * 0.2) return 'x2';
    if (randomValue <= lossThreshold * 0.4) return 'x1';
    if (randomValue <= lossThreshold * 0.8) return 'x0.5';
    return 'x0.7';
  }
  throw new Error('Invalid map number');
}

function calculatePayout(valuePambii: number, multiplier: string): number {
  return valuePambii * parseFloat(multiplier.slice(1));
}

function simulatePlayers(numPlayers: number, valuePambii: number, mapNumber: number): PlayerResult[] {
  const results: PlayerResult[] = [];

  for (let i = 0; i < numPlayers; i++) {
    const multiplier = calculateResult(mapNumber);
    const payout = calculatePayout(valuePambii, multiplier);
    const experience = calculateExperience(multiplier, mapNumber);

    results.push({
      player: i + 1,
      mapNumber,
      multiplier,
      payout,
      experience,
    });
  }

  return results;
}

// Función para calcular el conteo global de ganadores y perdedores y estadísticas financieras
function calculateGlobalStats(results: PlayerResult[], valuePambii: number) {
  const totalGames = results.length;
  let wins = 0;
  let losses = 0;
  let totalPaidOut = 0;
  const totalBet = totalGames * valuePambii;

  results.forEach((result) => {
    if (result.experience.win === 1) {
      wins++;
      totalPaidOut += result.payout;
    } else {
      losses++;
    }
  });

  const winPercentage = (wins / totalGames) * 100;
  const lossPercentage = (losses / totalGames) * 100;

  const systemRetained = totalBet - totalPaidOut;
  const systemRetainedPercentage = (systemRetained / totalBet) * 100;

  return {
    totalGames,
    wins,
    losses,
    winPercentage,
    lossPercentage,
    totalBet,
    totalPaidOut,
    systemRetained,
    systemRetainedPercentage,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const numPlayers = parseInt(searchParams.get('numPlayers') || '10', 10);
  const valuePambii = parseFloat(searchParams.get('valuePambii') || '100');
  const map = parseFloat(searchParams.get('map') || '1');

  if (isNaN(numPlayers) || isNaN(valuePambii) || numPlayers <= 0 || valuePambii <= 0) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  const simulationResults = simulatePlayers(numPlayers, valuePambii, map);

  const globalStats = calculateGlobalStats(simulationResults, valuePambii);

  return NextResponse.json({
    stats: {
      totalGames: globalStats.totalGames,
      wins: globalStats.wins,
      losses: globalStats.losses,
      winPercentage: globalStats.winPercentage.toFixed(2),
      lossPercentage: globalStats.lossPercentage.toFixed(2),
      totalBet: globalStats.totalBet,
      totalPaidOut: globalStats.totalPaidOut.toFixed(2) + ' PAMBII',
      systemRetained: globalStats.systemRetained.toFixed(2) + ' PAMBII',
      systemRetainedPercentage: globalStats.systemRetainedPercentage.toFixed(2),
    },
  });
}
