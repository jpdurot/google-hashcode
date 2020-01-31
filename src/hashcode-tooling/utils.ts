export function randIntMinMax(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randIntMax(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randomInArray<T>(array: T[]): T {
  return array[randIntMax(array.length - 1)];
}
