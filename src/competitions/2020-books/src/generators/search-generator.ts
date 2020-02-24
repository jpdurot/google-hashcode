import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { PreConditions } from '../models/preConditions';
import { Solution } from '../models/solution';
import { SignedUpLibrary } from '../models/signedUpLibrary';

export class SearchGenerator implements ISolutionGenerator<PreConditions, Solution> {
  static NAME = 'Search';
  hasNextGenerator: boolean = true;

  get name(): string {
    return SearchGenerator.NAME;
  }

  next(preConditions: PreConditions): Solution {
    // This is one shot
    this.hasNextGenerator = false;

    let solution = new Solution(preConditions);
    let searchGroup = this.generateSearchGroup(preConditions).sort(
      (l1, l2) => solution.getLibraryScore(l1) - solution.getLibraryScore(l2)
    );

    while (searchGroup.length > 0) {
      let originalLibrary = searchGroup.pop() as SignedUpLibrary;
      let precLibrary = preConditions.libraries[originalLibrary.libraryId];
      precLibrary.taken = true;
      if (solution.canAddLibrary(precLibrary.signupDays)) {
        solution.addSignedUpLibrary(originalLibrary);
      }
      searchGroup = this.generateSearchGroup(preConditions).sort(
        (l1, l2) => solution.getLibraryScore(l1) - solution.getLibraryScore(l2)
      );
    }

    return solution;
  }

  generateSearchGroup(preConditions: PreConditions): SignedUpLibrary[] {
    let possibleLibraries = preConditions.libraries.filter(l => !l.taken);
    let searchGroup: SignedUpLibrary[] = [];
    for (let i = 0; i < possibleLibraries.length; i++) {
      searchGroup.push(new SignedUpLibrary(possibleLibraries[i].bookIds, possibleLibraries[i].id));
    }

    return searchGroup;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
