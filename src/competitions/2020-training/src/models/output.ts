import { Input } from './input';
import { OutputString } from '../../../../hashcode-tooling/output-string';
import { BaseSolution } from '../../../../hashcode-tooling/base-solution';
import { ISolution } from '../../../../hashcode-tooling/i-solution';

export class Output extends BaseSolution<Input> implements ISolution<Input> {
  private orderedPizzaTypes: Array<number> = [];

  addOrder(pizzaType: number): void {
    this.orderedPizzaTypes.push(pizzaType);
    // Note: could be more simple if score is not cached but calculated at each call to get score(), wouldn't have
    // to handle it in addOrder and rollback.
    this.score += this.preconditions.pizzaTypes[pizzaType];
  }

  rollback(): boolean {
    const lastPizzaType = this.orderedPizzaTypes.pop();
    if (!lastPizzaType) {
      return false;
    }
    this.score -= this.preconditions.pizzaTypes[lastPizzaType];
    return true;
  }

  toOutputString(): string {
    const output = new OutputString();
    output.addValue(this.orderedPizzaTypes.length);
    output.nextLine();
    output.addValues(this.orderedPizzaTypes);
    return output.string;
  }

  isValid(): boolean {
    return this.score <= this.preconditions.maximumSlices;
  }
}
