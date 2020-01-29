import { Solution } from './solution'
import { SolutionGenerator } from './solution-generator'
import { Scanner } from './files/scanner'

export class SolutionFinder<TResult extends Solution<TPreConditions>, TPreConditions> {

    private fileScanner: Scanner;
    private bestValue:number = Number.MIN_VALUE;
    private bestSolution: TResult = null;
    private bestIterationCount:number = 0;

    constructor(private inputFile: string, private generator: SolutionGenerator<TPreConditions, TResult>) {
        this.fileScanner = new Scanner(inputFile);
    }

    findSolution():void {

    }
}