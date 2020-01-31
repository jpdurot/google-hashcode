import { ISolution } from './i-solution';

export interface ISolutionGenerator<TPreConditions, TResult extends ISolution<TPreConditions>> {
  getName(): string;
  next(preConditions: TPreConditions): TResult;
  hasNext(): boolean;
}
