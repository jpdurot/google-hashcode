import { Dictionary } from 'typescript-collections';
import * as fs from 'fs';

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

export function readFilesFrom(dirName: string) {
  return fs.readdirSync(dirName, { withFileTypes: true }).filter(f => !f.isDirectory());
}

export const writeFile = (fileName: string, content: string | undefined) => {
  fs.writeFile(fileName, content, () => console.log(`Written: ${fileName}`));
};
