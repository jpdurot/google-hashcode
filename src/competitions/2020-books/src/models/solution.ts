import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { PreConditions } from './preConditions';
import { OutputString } from '../../../../hashcode-tooling/output-string';
import { SignedUpLibrary } from './signedUpLibrary';

export class Solution implements ISolution<PreConditions> {
  signedUpLibraries: SignedUpLibrary[] = [];
  currentSignUpDays = 0;
  currentScore = 0;

  constructor(public state: PreConditions) {}

  get score() {
    return this.currentScore;
  }

  addSignedUpLibrary(library: SignedUpLibrary) {
    /*let originalLibrary = this.state.libraries[library.libraryId];
    this.currentSignUpDays += this.state.signUpDays;
    let booksPerDay = 2;

    for(let i = 0; i < library.scannedBooks.length; i += booksPerDay) {
      if(this.currentSignUpDays + i)
    }*/
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
