import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { AvailablePizzaState } from '../models/availablePizzaState';
import { PizzaOrder } from '../models/pizzaOrder';
import { readFilesFrom, writeFile } from '../../../../hashcode-tooling/utils';
import * as path from 'path';
import { OutputFile } from '../../../../hashcode-tooling/output-file-utils';
import * as fs from 'fs';

export class LoadFromFileGenerator implements ISolutionGenerator<AvailablePizzaState, PizzaOrder> {
  static NAME = 'LoadFromFile';
  hasNextGenerator: boolean = true;

  get name(): string {
    return LoadFromFileGenerator.NAME;
  }

  next(preConditions: AvailablePizzaState): PizzaOrder {
    // This is one shot
    this.hasNextGenerator = false;

    const outputPath = ''; // Here get the output path from other generators

    readFilesFrom(outputPath).forEach(f => {
      let fullName = path.join(outputPath, f.name);

      const info = OutputFile.fromOutputFileName(fullName);
      if (info.isDumpFile) {
        const content = fs.readFileSync(fullName).toString();

        // TODO Not working today
        // @ts-ignore
        const solution = new PizzaOrder(null).fromDumpString(content);

        // TODO do something with the existing solution if it is the best one (input.score)

        return solution;
      }
    });

    // @ts-ignore
    return null;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
