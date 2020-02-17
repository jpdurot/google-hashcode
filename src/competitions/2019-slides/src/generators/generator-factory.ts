import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { DumbHorizontalGenerator } from './dumb-horizontal-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from './../models/slideShowSolution';
import { RandomGenerator } from './random-generator';
import { IntersectionGenerator } from './intersection-generator';
import { SetIntersectionGenerator } from './set-intersection-generator';
import { GroupSelectionGenerator } from './group-selection-generator';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbHorizontalGenerator.NAME.toUpperCase()]: () => new DumbHorizontalGenerator(),
    [RandomGenerator.NAME.toUpperCase()]: () => new RandomGenerator(),
    [IntersectionGenerator.NAME.toUpperCase()]: () => new IntersectionGenerator(),
    [SetIntersectionGenerator.NAME.toUpperCase()]: () => new SetIntersectionGenerator(),
    [GroupSelectionGenerator.NAME.toUpperCase()]: () => new GroupSelectionGenerator()
  };

  public static from(name: string): ISolutionGenerator<SlideShowState, SlideShowSolution> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
