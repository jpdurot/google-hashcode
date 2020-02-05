import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { AvailablePizzaState } from '../models/availablePizzaState';
import { PizzaOrder } from '../models/pizzaOrder';
import { DumbGenerator } from './dumb-generator';
import { RandomGenerator } from './random-generator';
import { RandomGeneratorV2 } from './random-v2-generator';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbGenerator.NAME.toUpperCase()]: () => new DumbGenerator(),
    [RandomGenerator.NAME.toUpperCase()]: () => new RandomGenerator(),
    [RandomGeneratorV2.NAME.toUpperCase()]: () => new RandomGeneratorV2()
  };

  public static from(name: string): ISolutionGenerator<AvailablePizzaState, PizzaOrder> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
