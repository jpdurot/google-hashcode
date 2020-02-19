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
}
