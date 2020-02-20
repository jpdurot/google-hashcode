import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Book } from './book';

export class PreConditions {
  public numberOfBooks: number;
  public numberOfDays: number;
  public numberOfLibraries: number;

  public books: Array<Book> = [];
  public booksById: { [id: number]: Book } = {};

  constructor(scanner: Scanner) {
    this.numberOfBooks = scanner.nextInt();
    this.numberOfLibraries = scanner.nextInt();
    this.numberOfDays = scanner.nextInt();

    for (let b = 0; b < this.numberOfBooks; b++) {
      const book = new Book(b, scanner.nextInt());
      this.books.push(book);
      this.booksById[book.id] = book;
    }
  }
}
