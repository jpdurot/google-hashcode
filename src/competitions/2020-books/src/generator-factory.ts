import { ISolutionGenerator } from '../../../hashcode-tooling/i-solution-generator';
import { DumbGenerator } from './generators/dumb-generator';
import { Solution } from './models/solution';
import { PreConditions } from './models/preConditions';
import { ConsoleGenerator } from './generators/console-generator';
import { LessDumbGenerator } from './generators/less-dumb-generator';
import { BookOnceGenerator } from './generators/book-once-generator';
import { SortedGenerator } from './generators/sorted-generator';
import { SearchGenerator } from './generators/search-generator';
import { GeneticGenerator } from './generators/genetic-generator';
import { SmartGeneticGenerator } from './generators/smart-genetic-generator';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbGenerator.NAME.toUpperCase()]: () => new DumbGenerator(),
    [ConsoleGenerator.NAME.toUpperCase()]: () => new ConsoleGenerator(),
    [LessDumbGenerator.NAME.toUpperCase()]: () => new LessDumbGenerator(),
    [BookOnceGenerator.NAME.toUpperCase()]: () => new BookOnceGenerator(),
    [SortedGenerator.NAME.toUpperCase()]: () => new SortedGenerator(),
    [SearchGenerator.NAME.toUpperCase()]: () => new SearchGenerator(),
    [GeneticGenerator.NAME.toUpperCase()]: () => new GeneticGenerator(),
    [SmartGeneticGenerator.NAME.toUpperCase()]: () => new SmartGeneticGenerator()
  };

  public static from(name: string): ISolutionGenerator<PreConditions, Solution> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
