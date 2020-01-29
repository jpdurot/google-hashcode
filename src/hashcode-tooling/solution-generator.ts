import { Solution } from './solution'

export interface SolutionGenerator<TPreConditions, TResult extends Solution<TPreConditions>> {
    next(preConditions: TPreConditions): TResult;
}