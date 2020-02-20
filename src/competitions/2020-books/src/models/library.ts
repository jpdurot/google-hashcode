import { Book } from './book';
import math = require('mathjs');

export class Library {
  public bookIds: number[] = [];
  public score?: number;

  constructor(public id: number, public signupDays: number, public booksPerDay: number) {}

  public calculateScore(books: Book[], numberOfDays: number) {
    // score = average of score of all books * booksPerDay * (this.numberOfDays - signUpDays)
    this.score =
      math.mean(...this.bookIds.map(id => books[id].score)) * this.booksPerDay * (numberOfDays - this.signupDays);
  }
}
