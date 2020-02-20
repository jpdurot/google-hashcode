export class SignedUpLibrary {
  constructor(public scannedBooks: number[], public libraryId: number) {}

  addScannedBook(bookId: number) {
    this.scannedBooks.push(bookId);
  }
}
