export interface ISolution<TPreConditions> {
  score: number;
  toOutputString(): string;
  isValid(): boolean;
  toDumpString(): string;
  populateFromDumpString(dumpString: string): void;
}
