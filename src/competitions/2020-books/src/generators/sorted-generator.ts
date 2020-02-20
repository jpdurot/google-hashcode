import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { PreConditions } from '../models/preConditions';
import { Solution } from '../models/solution';
import { SignedUpLibrary } from '../models/signedUpLibrary';

export class SortedGenerator implements ISolutionGenerator<PreConditions, Solution> {
  static NAME = 'Sorted';
  hasNextGenerator: boolean = true;

  get name(): string {
    return SortedGenerator.NAME;
  }

  next(preConditions: PreConditions): Solution {
    // This is one shot
    this.hasNextGenerator = false;

    let solution = new Solution(preConditions);

    preConditions.libraries.sort((firstLibrary, secondLibrary) => firstLibrary.score - secondLibrary.score);

    for (let i = 0; i < preConditions.libraries.length; i++) {
      console.log(`Taken libraries: ${i}, All libraries: ${preConditions.libraries.length}`);
      let originalLibrary = preConditions.libraries[i];
      if (solution.canAddLibrary(originalLibrary.signupDays)) {
        let signedLibrary = new SignedUpLibrary([...originalLibrary.bookIds], originalLibrary.id);
        solution.addSignedUpLibrary(signedLibrary);
      }
    }

    // Do something clever

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
