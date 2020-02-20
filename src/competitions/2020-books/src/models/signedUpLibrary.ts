export class SignedUpLibrary {
  constructor(public scannedBooks: number[]) {}

  addScannedBook(bookId: number) {
    this.scannedBooks.push(bookId);
  }
}
