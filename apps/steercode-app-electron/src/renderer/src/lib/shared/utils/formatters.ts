export function roundValue(num: number, digits: number = 2) {
  const factor = Math.pow(10, digits);
  return Math.round(num * factor) / factor;
}
