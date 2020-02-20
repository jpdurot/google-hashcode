import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { PreConditions } from '../models/preConditions';
import { Solution } from '../models/solution';
import { SignedUpLibrary } from '../models/signedUpLibrary';

export class DumbGenerator implements ISolutionGenerator<PreConditions, Solution> {
  static NAME = 'Dumb';
  hasNextGenerator: boolean = true;

  get name(): string {
    return DumbGenerator.NAME;
  }

  next(preConditions: PreConditions): Solution {
    // This is one shot
    this.hasNextGenerator = false;

    let solution = new Solution(preConditions);

    let firstLibrary = preConditions.libraries[0];
    let firstSignedLibrary = new SignedUpLibrary([...firstLibrary.bookIds], firstLibrary.id);
    solution.addSignedUpLibrary(firstSignedLibrary);

    // Do something clever

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
