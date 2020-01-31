import { ISolution } from './i-solution';

export interface ISolutionGenerator<TPreConditions, TResult extends ISolution<TPreConditions>> {
  name: string;
  next(preConditions: TPreConditions): TResult;
  hasNext(): boolean;
}
