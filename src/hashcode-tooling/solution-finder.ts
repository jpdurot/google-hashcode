import { Solution } from './solution'
import { SolutionGenerator } from './solution-generator'
import { Scanner } from './files/scanner'
import * as fs from 'fs';

export class SolutionFinder<TResult extends Solution<TPreConditions>, TPreConditions> {

    private fileScanner: Scanner;
    private bestScore:number = Number.MIN_VALUE;
    private bestSolution: TResult? = null;
    private bestIterationCount:number = 0;
    private preconditions: TPreConditions;

    constructor(private inputFile: string, preconditionsFactory: (scanner: Scanner) => TPreConditions, private generator: SolutionGenerator<TPreConditions, TResult>) {
        this.fileScanner = new Scanner(inputFile);
        this.preconditions = preconditionsFactory(this.fileScanner);
    }

    findSolution():void {
        this.bestSolution = null;
        this.bestIterationCount = 0;
        this.bestScore = Number.MIN_VALUE;
        while (this.generator.hasNext()) {
            const result:TResult = this.generator.next(this.preconditions);
            const score:number = result.getScore(this.preconditions);

            if (score > this.bestScore) {
                this.bestScore = score;
                this.bestSolution = result;
                this.bestIterationCount++;
                console.log(`New solution found for ${this.inputFile} - Score = ${score}`);
                this.writeSolution();
            }
        }
    }

    writeSolution() {
        const solutionString = this.bestSolution?.toOutputString();
        fs.writeFileSync(`${this.inputFile}_${this.bestScore}_${this.bestIterationCount}_${this.generator.getName()}.out`,
            solutionString);
    }

    static launchOnSeveralFiles<TPreConditions, TResult extends Solution<TPreConditions>>(fileNames: Array<string>,
        preconditionsFactory: (scanner: Scanner) => TPreConditions,
        generatorFactory: () => SolutionGenerator<TPreConditions, TResult>): void {
            
        var solutionFinders: Array<SolutionFinder<TResult, TPreConditions>> = fileNames.map((f, _, __) =>
            new SolutionFinder<TResult, TPreConditions>(f, preconditionsFactory, generatorFactory()
        ));

        // TODO: run all solution finders in parallel (worker threads ??)
		solutionFinders.forEach(finder => finder.findSolution());
	}
}