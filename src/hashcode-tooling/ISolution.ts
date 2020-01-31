export interface ISolution<TPreConditions> {
  getScore(preConditions: TPreConditions): number;
  toOutputString(): string;
}
