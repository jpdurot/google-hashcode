import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { Input } from '../models/input';
import { Output } from '../models/output';
import * as Collections from 'typescript-collections';
import { randomInArray, randIntMax } from '../../../../hashcode-tooling/utils';

export class RandomGenerator implements ISolutionGenerator<Input, Output> {
  static NAME = 'Random';
  hasNextGenerator: boolean = true;

  get name(): string {
    return RandomGenerator.NAME;
  }

  next(preConditions: Input): Output {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new Output(preConditions);

    const availablePizzaTypes = new Collections.Set<number>();
    preConditions.pizzaTypes.forEach((type, i) => availablePizzaTypes.add(i));

    // console.log(`Available types: ${availablePizzaTypes.size()}`);

    while (availablePizzaTypes.size() != 0) {
      const i = randomInArray(availablePizzaTypes.toArray());

      //console.log(availablePizzaTypes.keys());

      solution.addOrder(i);

      if (!solution.isValid()) {
        solution.rollback();
        break;
      } else {
        // TODO this could be done inside the Output object
        availablePizzaTypes.remove(i);
      }
    }

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
