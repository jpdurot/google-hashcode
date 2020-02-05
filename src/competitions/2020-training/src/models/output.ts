import { Input } from './input';
import { OutputString } from '../../../../hashcode-tooling/output-string';
import { BaseSolution } from '../../../../hashcode-tooling/base-solution';
import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { Dictionary } from 'typescript-collections';

export class Output extends BaseSolution<Input> implements ISolution<Input> {
  private orderedPizzaTypes: Dictionary<number, number> = new Dictionary<number, number>();

  takePizza(pizzaType: number): void {
    // Note: could be more simple if score is not cached but calculated at each call to get score(), wouldn't have
    const score = this.preconditions.pizzaTypes.getValue(pizzaType) || 0;
    this.orderedPizzaTypes.setValue(pizzaType, score);
    this.preconditions.pizzaTypes.remove(pizzaType);
    this.score += score;
  }

  removePizza(pizzaType: number): void {
    const score = this.orderedPizzaTypes.getValue(pizzaType) || 0;
    this.preconditions.pizzaTypes.setValue(pizzaType, score);
    this.orderedPizzaTypes.remove(pizzaType);
    this.score -= score;
  }

  toOutputString(): string {
    const output = new OutputString();
    output.addValue(this.orderedPizzaTypes.keys().length);
    output.nextLine();
    output.addValues(this.orderedPizzaTypes.keys());
    return output.string;
  }

  isValid(): boolean {
    return this.score <= this.preconditions.maximumSlices;
  }
}
