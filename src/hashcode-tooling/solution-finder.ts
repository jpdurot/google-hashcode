import { ISolution } from './i-solution';
import { ISolutionGenerator } from './i-solution-generator';
import { Scanner } from './files/scanner';
import * as fs from 'fs';
import * as path from 'path';

export class SolutionFinder<TResult extends ISolution<TPreConditions>, TPreConditions> {
  private readonly fileScanner: Scanner;
  private bestScore: number = Number.MIN_VALUE;
  private bestSolution: TResult | null = null;
  private improvementsCount: number = 0;
  private readonly preconditions: TPreConditions;

  get shortInputName() {
    return path.basename(this.inputFile);
  }

  constructor(
    private inputFile: string,
    preconditionsFactory: (scanner: Scanner) => TPreConditions,
    private generator: ISolutionGenerator<TPreConditions, TResult>
  ) {
    this.fileScanner = new Scanner(inputFile);
    this.preconditions = preconditionsFactory(this.fileScanner);

    console.log(`Importing ${inputFile}`);
  }

  findSolution(): void {
    this.bestSolution = null;
    this.improvementsCount = 0;
    this.bestScore = Number.MIN_VALUE;
    while (this.generator.hasNext()) {
      const result: TResult = this.generator.next(this.preconditions);
      const score: number = result.score;

      if (score > this.bestScore) {
        this.bestScore = score;
        this.bestSolution = result;
        this.improvementsCount++;
        console.log(`[${this.generator.name}] New solution found for ${this.shortInputName} - Score = ${score}`);
        this.writeSolution();
      }
    }
  }

  writeSolution() {
    const solutionString = this.bestSolution?.toOutputString();

    const outputPath = path.dirname(this.inputFile) + '/../output';

    fs.writeFileSync(
      `${outputPath}/${this.shortInputName}_${this.bestScore}_${this.improvementsCount}_${this.generator.name}.out`,
      solutionString
    );
  }

  static launchOnSeveralFiles<TPreConditions, TResult extends ISolution<TPreConditions>>(
    fileNames: Array<string>,
    preconditionsFactory: (scanner: Scanner) => TPreConditions,
    generatorFactory: () => ISolutionGenerator<TPreConditions, TResult>
  ): void {
    var solutionFinders: Array<SolutionFinder<TResult, TPreConditions>> = fileNames.map(
      (f, _, __) => new SolutionFinder<TResult, TPreConditions>(f, preconditionsFactory, generatorFactory())
    );

    // TODO: run all solution finders in parallel (worker threads ??)
    solutionFinders.forEach(finder => finder.findSolution());
  }
}
