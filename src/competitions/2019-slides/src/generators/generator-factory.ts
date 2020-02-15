import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { DumbHorizontalGenerator } from './dumb-horizontal-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from './../models/slideShowSolution';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbHorizontalGenerator.NAME.toUpperCase()]: () => new DumbHorizontalGenerator()
  };

  public static from(name: string): ISolutionGenerator<SlideShowState, SlideShowSolution> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
