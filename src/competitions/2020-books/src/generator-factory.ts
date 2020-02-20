import { ISolutionGenerator } from '../../../hashcode-tooling/i-solution-generator';
import { DumbGenerator } from './generators/dumb-generator';
import { Solution } from './models/solution';
import { PreConditions } from './models/preConditions';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbGenerator.NAME.toUpperCase()]: () => new DumbGenerator()
  };

  public static from(name: string): ISolutionGenerator<PreConditions, Solution> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
