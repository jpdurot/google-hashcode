export interface ISolution<TPreConditions> {
  score: number;
  toOutputString(): string;
  isValid(): boolean;
}
