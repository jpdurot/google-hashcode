import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { Input } from '../models/input';
import { Output } from '../models/output';

export class DumbGenerator implements ISolutionGenerator<Input, Output> {
  static NAME = 'Dumb';
  hasNextGenerator: boolean = true;

  get name(): string {
    return DumbGenerator.NAME;
  }

  next(preConditions: Input): Output {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new Output(preConditions);

    for (let i = 0; i < preConditions.pizzaTypes.keys().length; i++) {
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
