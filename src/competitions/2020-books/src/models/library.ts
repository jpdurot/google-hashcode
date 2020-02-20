import { Book } from './book';
import math = require('mathjs');

export class Library {
  public bookIds: number[] = [];
  public score: number = 0;

  constructor(public id: number, public signupDays: number, public booksPerDay: number) {}

  public calculateScore(books: Book[], numberOfDays: number) {
    // score = average of score of all books * booksPerDay * (this.numberOfDays - signUpDays)
    let numberOfExpectedBooks = (numberOfDays - this.signupDays) * this.booksPerDay;
    let booksScore = this.bookIds.map(id => books[id].score);

    for (let i = 0; i < numberOfExpectedBooks && i < this.bookIds.length; i++) {
      this.score += booksScore[i];
    }
  }
}
