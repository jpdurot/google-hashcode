import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { DumbGenerator } from './dumb-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from './../models/slideShowSolution';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbGenerator.NAME.toUpperCase()]: () => new DumbGenerator()
  };

  public static from(name: string): ISolutionGenerator<SlideShowState, SlideShowSolution> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
