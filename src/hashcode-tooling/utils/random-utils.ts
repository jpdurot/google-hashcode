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

// Took and adapted from @nicolashery's https://gist.github.com/nicolashery/5885280
export function randomExponential(rate: number) {
  // http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
  rate = rate || 1;

  // Allow to pass a random uniform value or function
  // Default to Math.random()
  var U = Math.random();

  return -Math.log(U) / rate;
}

export function randIntMaxExponential(max: number, rate: number) {
  let randInt = Math.round(randomExponential(rate));
  return randInt < max ? randInt : max;
}
