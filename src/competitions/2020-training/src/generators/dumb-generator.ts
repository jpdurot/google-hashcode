import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { AvailablePizzaState } from '../models/availablePizzaState';
import { PizzaOrder } from '../models/pizzaOrder';
import { readFilesFrom, writeFile } from '../../../../hashcode-tooling/utils/file-utils';
import * as path from 'path';
import { OutputFile } from '../../../../hashcode-tooling/output-file-utils';
import * as fs from 'fs';

export class DumbGenerator implements ISolutionGenerator<AvailablePizzaState, PizzaOrder> {
  static NAME = 'Dumb';
  hasNextGenerator: boolean = true;

  get name(): string {
    return DumbGenerator.NAME;
  }

  next(preConditions: AvailablePizzaState): PizzaOrder {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new PizzaOrder(preConditions);

    for (let i = 0; i < solution.state.availablePizzas.keys().length; i++) {
      solution.takePizza(i);

      if (!solution.isValid()) {
        solution.removePizza(i);
        break;
      }
    }

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }

  testDump(outputPath: string) {
    // Not working
    readFilesFrom(outputPath).forEach(f => {
      let fullName = path.join(outputPath, f.name);
      const info = OutputFile.fromOutputFileName(fullName);
      if (info.isDumpFile) {
        const content = fs.readFileSync(fullName).toString();
        // @ts-ignore
        const solution = new PizzaOrder(null).fromDumpString(content);

        console.log(solution);

        const outputFile = new OutputFile(info.inputName, solution.score, info.improvementsCount, info.generatorName);

        writeFile(`${outputPath}/${outputFile.fileName()}.test`, solution.toOutputString());
      }
    });
  }
}
