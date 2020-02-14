import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { AvailablePizzaState } from '../models/availablePizzaState';
import { PizzaOrder } from '../models/pizzaOrder';
import * as Collections from 'typescript-collections';
import { randomInArray } from '../../../../hashcode-tooling/utils/random-utils';

export class RandomGenerator implements ISolutionGenerator<AvailablePizzaState, PizzaOrder> {
  static NAME = 'Random';
  hasNextGenerator: boolean = true;

  get name(): string {
    return RandomGenerator.NAME;
  }

  next(preConditions: AvailablePizzaState): PizzaOrder {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new PizzaOrder(preConditions);

    while (solution.state.availablePizzas.size() != 0) {
      const i = randomInArray(solution.state.availablePizzas.keys());

      //console.log(availablePizzaTypes.keys());

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
