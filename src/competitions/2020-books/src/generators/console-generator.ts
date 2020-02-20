import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { PreConditions } from '../models/preConditions';
import { Solution } from '../models/solution';

export class ConsoleGenerator implements ISolutionGenerator<PreConditions, Solution> {
  static NAME = 'Console';
  hasNextGenerator: boolean = true;

  get name(): string {
    return ConsoleGenerator.NAME;
  }

  next(preConditions: PreConditions): Solution {
    // This is one shot
    this.hasNextGenerator = false;

    let solution = new Solution(preConditions);

    preConditions.libraries.forEach(l => {
      console.log(`${l.id}: ${l.score}`);
    });

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
