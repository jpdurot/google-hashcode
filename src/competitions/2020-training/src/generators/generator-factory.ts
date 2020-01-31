import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { Input } from '../models/input';
import { Output } from '../models/output';
import { DumbGenerator } from './dumb-generator';
import { RandomGenerator } from './random-generator';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbGenerator.NAME.toUpperCase()]: () => new DumbGenerator(),
    [RandomGenerator.NAME.toUpperCase()]: () => new RandomGenerator()
  };

  public static from(name: string): ISolutionGenerator<Input, Output> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
