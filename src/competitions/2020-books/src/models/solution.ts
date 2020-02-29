import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { PreConditions } from './preConditions';
import { OutputString } from '../../../../hashcode-tooling/output-string';
import { SignedUpLibrary } from './signedUpLibrary';
import { Library } from './library';

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

    this.signedUpLibraries.push(library);

    let done = false;
    for (let i = this.currentSignUpDay; i < this.state.numberOfDays && !done; i++) {
      let currentIIndex = i - this.currentSignUpDay;
      for (let j = 0; j < booksPerDay && !done; j++) {
        let addedBookId = library.scannedBooks[currentIIndex * booksPerDay + j];
        if (addedBookId === undefined) {
          done = true;
        } else {
          this.currentScore += this.state.books[addedBookId].isAvailable ? this.state.books[addedBookId].score : 0;
          this.state.books[addedBookId].isAvailable = false;
        }
      }
    }
  }

  getLibraryScore(library: SignedUpLibrary): number {
    let originalLibrary = this.state.libraries[library.libraryId];
    let booksPerDay = originalLibrary.booksPerDay;
    let newDays = this.currentSignUpDay + originalLibrary.signupDays;

    let score = 0;
    let done = false;

    if (newDays > this.state.numberOfDays) {
      return 0;
    }
    for (let i = newDays; i < this.state.numberOfDays && !done; i++) {
      let currentIIndex = i - newDays;
      for (let j = 0; j < booksPerDay && !done; j++) {
        let addedBookId = library.scannedBooks[currentIIndex * booksPerDay + j];
        if (addedBookId === undefined) {
          done = true;
        } else {
          score += this.state.books[addedBookId].isAvailable ? this.state.books[addedBookId].score : 0;
        }
      }
    }

    return score / originalLibrary.signupDays;
  }

  getPossibleLibraryScore(originalLibrary: Library): number {
    let booksPerDay = originalLibrary.booksPerDay;
    let newDays = this.currentSignUpDay + originalLibrary.signupDays;

    let score = 0;
    let done = false;

    if (newDays > this.state.numberOfDays) {
      return 0;
    }
    for (let i = newDays; i < this.state.numberOfDays && !done; i++) {
      let currentIIndex = i - newDays;
      for (let j = 0; j < booksPerDay && !done; j++) {
        let addedBookId = originalLibrary.bookIds[currentIIndex * booksPerDay + j];
        if (addedBookId === undefined) {
          done = true;
        } else {
          score += this.state.books[addedBookId].isAvailable ? this.state.books[addedBookId].score : 0;
        }
      }
    }

    return score / originalLibrary.signupDays;
  }

  canAddLibrary(librarySignUpDays: number) {
    return this.currentSignUpDay + librarySignUpDays < this.state.numberOfDays;
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
