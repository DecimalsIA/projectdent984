// utils/gameUtils.ts
export function calculateResult(mapNumber: number, secureRandom: () => number): string {
  const randomValue = secureRandom();
  if (mapNumber === 1) {
    if (randomValue <= 0.08) return 'x2';
    if (randomValue <= 0.20) return 'x1.5';
    if (randomValue <= 0.45) return 'x1';
    if (randomValue <= 0.70) return 'x0.75';
    if (randomValue <= 0.90) return 'x0.5';
    return 'x0.1';
  } else if (mapNumber === 2) {
    if (randomValue <= 0.03) return 'x4';
    if (randomValue <= 0.13) return 'x2';
    if (randomValue <= 0.28) return 'x1.5';
    if (randomValue <= 0.53) return 'x1';
    if (randomValue <= 0.80) return 'x0.5';
    return 'x0.1';
  } else if (mapNumber === 3) {
    if (randomValue <= 0.01) return 'x10';
    if (randomValue <= 0.06) return 'x5';
    if (randomValue <= 0.18) return 'x2';
    if (randomValue <= 0.40) return 'x1';
    if (randomValue <= 0.70) return 'x0.5';
    return 'x0.1';
  }
  throw new Error('Invalid map number');
}

export function calculatePayout(valuePambii: number, multiplier: string): number {
  const baseValue = valuePambii;
  const multiplierValue = parseFloat(multiplier.slice(1));
  return baseValue * multiplierValue;
}
