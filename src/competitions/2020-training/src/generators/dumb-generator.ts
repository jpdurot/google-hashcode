import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { Input } from '../models/input';
import { Output } from '../models/output';

export class DumbGenerator implements ISolutionGenerator<Input, Output> {
  hasNextGenerator: boolean = true;

  getName(): string {
    return 'Dumb';
  }

  next(preConditions: Input): Output {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new Output(preConditions);

    for (let i = 0; i < preConditions.pizzaTypes.length; i++) {
      solution.addOrder(i);

      if (!solution.isValid()) {
        solution.rollback();
        break;
      }
    }

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
