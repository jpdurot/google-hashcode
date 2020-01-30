import { Solution } from './solution'

export interface SolutionGenerator<TPreConditions, TResult extends Solution<TPreConditions>> {
    getName(): string;
    next(preConditions: TPreConditions): TResult;
    hasNext(): boolean;
}