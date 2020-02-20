import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { PreConditions } from '../models/preConditions';
import { Solution } from '../models/solution';
import { SignedUpLibrary } from '../models/signedUpLibrary';

export class BookOnceGenerator implements ISolutionGenerator<PreConditions, Solution> {
  static NAME = 'BookOnce';
  hasNextGenerator: boolean = true;

  get name(): string {
    return BookOnceGenerator.NAME;
  }

  next(preConditions: PreConditions): Solution {
    // This is one shot
    this.hasNextGenerator = false;

    let solution = new Solution(preConditions);

    for (let i = 0; i < preConditions.libraries.length; i++) {
      let originalLibrary = preConditions.libraries[i];
      if (solution.canAddLibrary(originalLibrary.signupDays)) {
        let booksToScan = preConditions.filterAvailableBooks(originalLibrary.bookIds);
        if (booksToScan.length > 0) {
          preConditions.takeBooks(booksToScan);
          let signedLibrary = new SignedUpLibrary(booksToScan, originalLibrary.id);
          solution.addSignedUpLibrary(signedLibrary);
        }
      }
    }

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
