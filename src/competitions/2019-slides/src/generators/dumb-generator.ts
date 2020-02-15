import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from '../models/slideShowSolution';

export class DumbGenerator implements ISolutionGenerator<SlideShowState, SlideShowSolution> {
  static NAME = 'Dumb';
  hasNextGenerator: boolean = true;

  get name(): string {
    return DumbGenerator.NAME;
  }

  next(preConditions: SlideShowState): SlideShowSolution {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new SlideShowSolution(preConditions);

    return solution;
  }

  hasNext(): boolean {
    return false;
  }
}
