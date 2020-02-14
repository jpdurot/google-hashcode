import { Dictionary } from 'typescript-collections';

export function randIntMinMax(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randIntMax(max: number): number {
  return Math.floor(Math.random() * max);
}

export function randomInArray<T>(array: T[]): T {
  return array[randIntMax(array.length - 1)];
}

export function randomInDict<X, T>(dictionary: Dictionary<X, T>): T {
  const random = randIntMax(dictionary.size());
  let i = 0;
  let randValue;
  dictionary.forEach(c => {
    if (i === random) {
      randValue = c;
    }
    i++;
  });

  // @ts-ignore
  return randValue;
}
