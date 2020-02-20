import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { PreConditions } from './preConditions';
import { OutputString } from '../../../../hashcode-tooling/output-string';
import { SignedUpLibrary } from './signedUpLibrary';

export class Solution implements ISolution<PreConditions> {
  signedUpLibraries: SignedUpLibrary[] = [];
  currentSignUpDay = 0;
  currentScore = 0;

  constructor(public state: PreConditions) {}

  get score() {
    return this.currentScore;
  }

  addSignedUpLibrary(library: SignedUpLibrary) {
    let originalLibrary = this.state.libraries[library.libraryId];
    this.currentSignUpDay += originalLibrary.signupDays;
    let booksPerDay = originalLibrary.booksPerDay;

    for (let i = this.currentSignUpDay + 1; i < this.state.numberOfDays; i++) {
      let currentIIndex = i - this.currentSignUpDay - 1;
      for (let j = 0; j < booksPerDay; j++) {
        let addedBookId = library.scannedBooks[currentIIndex * booksPerDay + j];
        this.currentScore += this.state.books[addedBookId].score;
      }
    }
  }

  toOutputString(): string {
    const output = new OutputString();
    output.addValue(this.signedUpLibraries.length);
    for (let i = 0; i < this.signedUpLibraries.length; i++) {
      output.nextLine();
      output.addValue(this.signedUpLibraries[i].libraryId);
      output.addValue(this.signedUpLibraries[i].scannedBooks.length);
      output.nextLine();
      for (let j = 0; j < this.signedUpLibraries[i].scannedBooks.length; j++) {
        output.addValue(this.signedUpLibraries[i].scannedBooks[j]);
      }
    }

    return output.string;
  }
}
