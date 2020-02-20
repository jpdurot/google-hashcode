import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Book } from './book';
import { Library } from './library';

export class PreConditions {
  public numberOfBooks: number;
  public numberOfDays: number;
  public numberOfLibraries: number;

  public books: Array<Book> = [];
  public booksById: { [id: number]: Book } = {};

  public libraries: Library[] = [];
  public libraryById: { [id: number]: Library } = {};

  constructor(scanner: Scanner) {
    this.numberOfBooks = scanner.nextInt();
    this.numberOfLibraries = scanner.nextInt();
    this.numberOfDays = scanner.nextInt();

    for (let b = 0; b < this.numberOfBooks; b++) {
      const book = new Book(b, scanner.nextInt());
      this.books.push(book);
      this.booksById[book.id] = book;
    }

    for (let l = 0; l < this.numberOfLibraries; l++) {
      const nbBooks = scanner.nextInt();
      const signUpDays = scanner.nextInt();
      const booksPerDay = scanner.nextInt();
      const library = new Library(l, signUpDays, booksPerDay);
      for (let b = 0; b < nbBooks; b++) {
        library.bookIds.push(scanner.nextInt());
      }

      this.libraries.push(library);
      this.libraryById[library.id] = library;
    }
  }
}
