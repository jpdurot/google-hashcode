import { ISolution } from './i-solution';
import { ISolutionGenerator } from './i-solution-generator';
import { Scanner } from './files/scanner';
import * as fs from 'fs';
import * as path from 'path';
import { OutputFile } from './output-file-utils';

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
        console.log(`[${this.generator.name}] - ${this.shortInputName} New BEST = ${score}`);
        this.writeSolution();
      }
    }
  }

  writeSolution() {
    const solutionString = this.bestSolution?.toOutputString();

    const outputPath = path.join(path.dirname(path.dirname(this.inputFile)), 'output');

    const outputFileName = new OutputFile(
      this.shortInputName,
      this.bestScore,
      this.improvementsCount,
      this.generator.name
    );

    // Write file
    fs.writeFileSync(`${outputPath}/${outputFileName.fileName()}`, solutionString);

    // Override best file if needed
    const bestOutputPath = path.join(outputPath, 'best');

    let writeFile = true;

    fs.readdirSync(bestOutputPath).forEach(file => {
      let filename = path.join(bestOutputPath, file);
      const info = OutputFile.fromOutputFileName(filename);
      if (`${info.inputName}.in` === this.shortInputName) {
        if (info.score < this.bestScore) {
          console.log(`Improved best score: ${info.score} -> ${this.bestScore} - removing ${filename}`);
          fs.unlinkSync(filename);
        } else {
          // Existing score is higher
          writeFile = false;
        }
      }
    });

    if (writeFile) {
      fs.writeFileSync(`${bestOutputPath}/${outputFileName.fileName()}`, solutionString);
    }
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
