import { Input } from './input';
import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { OutputString } from '../../../../hashcode-tooling/OutputString';

export class Output implements ISolution<Input> {
  orderedPizzaTypes: Array<number> = [];

  getScore(preConditions: Input): number {
    if (this.orderedPizzaTypes.length == 0) return 0;
    const score: number = this.orderedPizzaTypes.map((t, i) => preConditions.pizzaTypes[i]).reduce((a, b) => a + b);

    return score > preConditions.maximumSlices ? 0 : score;
  }

  toOutputString(): string {
    const output = new OutputString();
    output.addValue(this.orderedPizzaTypes.length);
    output.nextLine();
    output.addValues(this.orderedPizzaTypes);
    return output.string;
  }
}
