import { NextResponse } from 'next/server';

// Importar las funciones necesarias para la simulación
const crypto = require('crypto');

// Tipos personalizados para los resultados
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
  if (mapNumber === 1) {
    if (randomValue <= 0.01) return 'x2';
    if (randomValue <= 0.07) return 'x1.5';
    if (randomValue <= 0.20) return 'x1';
    if (randomValue <= 0.30) return 'x0.75';
    if (randomValue <= 0.60) return 'x0.5';
    return 'x0.7';
  } else if (mapNumber === 2) {
    if (randomValue <= 0.02) return 'x4';
    if (randomValue <= 0.03) return 'x2';
    if (randomValue <= 0.12) return 'x1.5';
    if (randomValue <= 0.15) return 'x1';
    if (randomValue <= 0.35) return 'x0.5';
    return 'x0.7';
  } else if (mapNumber === 3) {
    if (randomValue <= 0.02) return 'x10';
    if (randomValue <= 0.03) return 'x5';
    if (randomValue <= 0.05) return 'x2';
    if (randomValue <= 0.10) return 'x1';
    if (randomValue <= 0.30) return 'x0.5';
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
    // const mapNumber = Math.floor(Math.random() * 3) + 1; // Selecciona un mapa aleatorio (1, 2, o 3)
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
  let totalPaidOut = 0; // Cantidad total pagada a los ganadores
  const totalBet = totalGames * valuePambii; // Cantidad total apostada

  results.forEach((result) => {
    if (result.experience.win === 1) {
      wins++;
      totalPaidOut += result.payout; // Sumar lo pagado a los ganadores
    } else {
      losses++;
    }
  });

  const winPercentage = (wins / totalGames) * 100;
  const lossPercentage = (losses / totalGames) * 100;

  // Calcular el porcentaje de dinero que se quedó en el sistema
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

// Endpoint GET que ejecuta la simulación
export async function GET(request: Request) {
  // Obtener los parámetros de la URL
  const { searchParams } = new URL(request.url);

  // Obtener los valores de numPlayers y valuePambii
  const numPlayers = parseInt(searchParams.get('numPlayers') || '10', 10); // Valor por defecto: 10
  const valuePambii = parseFloat(searchParams.get('valuePambii') || '100'); // 
  const map = parseFloat(searchParams.get('map') || '100'); // Valor por defecto: 100

  // Validar los parámetros
  if (isNaN(numPlayers) || isNaN(valuePambii) || numPlayers <= 0 || valuePambii <= 0) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  // Ejecutar la simulación
  const simulationResults = simulatePlayers(numPlayers, valuePambii, map);

  // Calcular las estadísticas globales
  const globalStats = calculateGlobalStats(simulationResults, valuePambii);

  // Respuesta en formato JSON
  return NextResponse.json({

    stats: {
      totalGames: globalStats.totalGames,
      wins: globalStats.wins,
      losses: globalStats.losses,
      winPercentage: globalStats.winPercentage.toFixed(2),
      lossPercentage: globalStats.lossPercentage.toFixed(2),
      totalBet: globalStats.totalBet,
      totalPaidOut: globalStats.totalPaidOut.toFixed(2),
      systemRetained: globalStats.systemRetained.toFixed(2),
      systemRetainedPercentage: globalStats.systemRetainedPercentage.toFixed(2),
    },
  });
}
