import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { PreConditions } from '../models/preConditions';
import { Solution } from '../models/solution';

export class DumbGenerator implements ISolutionGenerator<PreConditions, Solution> {
  static NAME = 'Dumb';
  hasNextGenerator: boolean = true;

  get name(): string {
    return DumbGenerator.NAME;
  }

  next(preConditions: PreConditions): Solution {
    // This is one shot
    this.hasNextGenerator = false;

    console.log(preConditions);

    let solution = new Solution(preConditions);

    // Do something clever

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
