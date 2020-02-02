export abstract class BaseSolution<TPreConditions> {
  private _score: number = 0;

  get score() {
    // Note the score is calculated once, not at each call
    return this._score;
  }

  set score(newScore: number) {
    this._score = newScore;
  }

  constructor(protected preconditions: TPreConditions) {}
}
