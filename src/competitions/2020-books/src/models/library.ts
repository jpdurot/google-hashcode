export class Library {
  public bookIds: number[] = [];

  constructor(public id: number, public signupDays: number, public booksPerDay: number) {}
}
