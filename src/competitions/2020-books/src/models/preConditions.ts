import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Book } from './book';
import { Library } from './library';

export class PreConditions {
  public numberOfBooks: number;
  public numberOfDays: number;
  public numberOfLibraries: number;

  public books: Book[] = [];

  public libraries: Library[] = [];

  constructor(scanner: Scanner) {
    this.numberOfBooks = scanner.nextInt();
    this.numberOfLibraries = scanner.nextInt();
    this.numberOfDays = scanner.nextInt();

    for (let b = 0; b < this.numberOfBooks; b++) {
      const book = new Book(b, scanner.nextInt());
      this.books.push(book);
    }

    //console.time("sortBooks");
    for (let l = 0; l < this.numberOfLibraries; l++) {
      const nbBooks = scanner.nextInt();
      const signUpDays = scanner.nextInt();
      const booksPerDay = scanner.nextInt();
      const library = new Library(l, signUpDays, booksPerDay);

      for (let b = 0; b < nbBooks; b++) {
        library.bookIds.push(scanner.nextInt());
      }

      library.bookIds = library.bookIds.sort((i, j) => this.books[j].score - this.books[i].score);
      library.calculateScore(this.books, this.numberOfDays);

      this.libraries.push(library);
    }
    //console.timeEnd("sortBooks");
    //console.timeLog("sortBooks");
  }

  public takeBooks(bookIds: number[]): void {
    bookIds.forEach(id => (this.books[id].isAvailable = false));
  }

  public filterAvailableBooks(bookIds: number[]): number[] {
    return bookIds.filter(id => this.books[id].isAvailable);
  }
}
