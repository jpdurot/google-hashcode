import { ISolutionGenerator } from '../../../hashcode-tooling/i-solution-generator';
import { DumbGenerator } from './generators/dumb-generator';
import { Solution } from './models/solution';
import { PreConditions } from './models/preConditions';
import { ConsoleGenerator } from './generators/console-generator';
import { LessDumbGenerator } from './generators/less-dumb-generator';
import { SortedGenerator } from './generators/sorted-generator';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbGenerator.NAME.toUpperCase()]: () => new DumbGenerator(),
    [ConsoleGenerator.NAME.toUpperCase()]: () => new ConsoleGenerator(),
    [LessDumbGenerator.NAME.toUpperCase()]: () => new LessDumbGenerator(),
    [SortedGenerator.NAME.toUpperCase()]: () => new SortedGenerator()
  };

  public static from(name: string): ISolutionGenerator<PreConditions, Solution> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
