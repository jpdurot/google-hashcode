import { ISolution } from './i-solution';
import { ISolutionGenerator } from './i-solution-generator';
import { Scanner } from './files/scanner';
import * as fs from 'fs';
import * as path from 'path';
import { OutputFile } from './output-file-utils';
import { writeFile } from './utils/file-utils';
import { LEVEL, Logger } from './utils/logger';

export class SolutionFinder<TResult extends ISolution<TPreConditions>, TPreConditions> {
  private readonly fileScanner: Scanner;
  private bestScore: number = Number.NEGATIVE_INFINITY;
  private bestSolution: TResult | null = null;
  private improvementsCount: number = 0;
  private readonly preconditions: TPreConditions;
  private outputPath: string;

  get shortInputName() {
    return path.basename(this.inputFile);
  }

  constructor(
    private inputFile: string,
    preconditionsFactory: (scanner: Scanner) => TPreConditions,
    private generator: ISolutionGenerator<TPreConditions, TResult>
  ) {
    Logger.print(`Importing ${inputFile} ...`);

    this.fileScanner = new Scanner(inputFile);
    this.preconditions = preconditionsFactory(this.fileScanner);

    this.outputPath = path.join(path.dirname(path.dirname(this.inputFile)), 'output');

    Logger.printLn('DONE');
  }

  findSolution(): void {
    this.bestSolution = null;
    this.improvementsCount = 0;
    this.bestScore = Number.NEGATIVE_INFINITY;
    while (this.generator.hasNext()) {
      const result: TResult = this.generator.next(this.preconditions);
      const score: number = result.score;

      if (score > this.bestScore) {
        this.bestScore = score;
        this.bestSolution = result;
        this.improvementsCount++;
        Logger.printLn(`[${this.generator.name}] - ${this.shortInputName} New BEST = ${score}`);
        this.writeSolution();
      }
    }
  }

  writeSolution() {
    const solutionString = this.bestSolution?.toOutputString();

    const outputFile = new OutputFile(this.shortInputName, this.bestScore, this.improvementsCount, this.generator.name);

    // Write file
    writeFile(`${this.outputPath}/${outputFile.fileName()}`, solutionString);

    // Override best file if needed
    try {
      const bestOutputPath = path.join(this.outputPath, 'best');
      let needToWriteFile = true;
      fs.readdirSync(bestOutputPath).forEach(file => {
        let filename = path.join(bestOutputPath, file);
        const info = OutputFile.fromOutputFileName(filename);
        if (`${info.inputName}.in` === this.shortInputName) {
          if (info.score < this.bestScore) {
            Logger.printLn(`Improved best score: ${info.score} -> ${this.bestScore} - removing ${filename}`);
            fs.unlinkSync(filename);
          } else {
            // Existing score is higher
            needToWriteFile = false;
          }
        }
      });

      if (needToWriteFile) {
        writeFile(`${bestOutputPath}/${outputFile.fileName()}`, solutionString);
      }
    } catch (e) {
      Logger.printLn('Error writing file in "/best" directory!', LEVEL.ERROR);
      Logger.printLn(e, LEVEL.ERROR);
    }
  }

  static launchOnSeveralFiles<TPreConditions, TResult extends ISolution<TPreConditions>>(
    fileNames: Array<string>,
    preconditionsFactory: (scanner: Scanner) => TPreConditions,
    generatorFactory: () => ISolutionGenerator<TPreConditions, TResult>
  ): void {
    fileNames.forEach((f, _, __) => {
      Logger.printLn(`${f} ------------------------------------------------ START`);
      new SolutionFinder<TResult, TPreConditions>(f, preconditionsFactory, generatorFactory()).findSolution();
      Logger.printLn(`${f} ------------------------------------------------   END`);
    });
  }
}
