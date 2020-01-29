export interface Solution<TPreConditions> {
    value(preConditions: TPreConditions): number;
    toOutputString():string;   
}