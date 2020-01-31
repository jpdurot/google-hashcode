import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { Input } from '../models/input';
import { Output } from '../models/output';
import * as Collections from 'typescript-collections';
import { randomInArray, randIntMax } from '../../../../hashcode-tooling/utils';

export class RandomGenerator implements ISolutionGenerator<Input, Output> {
  hasNextGenerator: boolean = true;

  getName(): string {
    return 'Random';
  }

  next(preConditions: Input): Output {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new Output(preConditions);

    const availablePizzaTypes = new Collections.Dictionary<number, boolean>();
    preConditions.pizzaTypes.forEach((type, i) => availablePizzaTypes.setValue(i, true));

    // console.log(`Available types: ${availablePizzaTypes.size()}`);

    while (availablePizzaTypes.size() != 0) {
      const i = randomInArray(availablePizzaTypes.keys());

      //console.log(availablePizzaTypes.keys());

      solution.addOrder(i);

      if (!solution.isValid()) {
        solution.rollback();
        break;
      } else {
        availablePizzaTypes.remove(i);
      }
    }

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
