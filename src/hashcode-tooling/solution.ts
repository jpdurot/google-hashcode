export interface Solution<TPreConditions> {
    getScore(preConditions: TPreConditions): number;
    toOutputString():string;   
}