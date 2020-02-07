import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { AvailablePizzaState } from '../models/availablePizzaState';
import { PizzaOrder } from '../models/pizzaOrder';
import { DumbGenerator } from './dumb-generator';
import { RandomGenerator } from './random-generator';
import { RandomGeneratorV2 } from './random-v2-generator';
import { RandomParallelGenerator } from './random-parallel-generator';
import { RandomGeneratorV2Temp } from './random-temp-generator';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbGenerator.NAME.toUpperCase()]: () => new DumbGenerator(),
    [RandomGenerator.NAME.toUpperCase()]: () => new RandomGenerator(),
    [RandomGeneratorV2.NAME.toUpperCase()]: () => new RandomGeneratorV2(),
    [RandomParallelGenerator.NAME.toUpperCase()]: () => new RandomParallelGenerator(),
    [RandomGeneratorV2Temp.NAME.toUpperCase()]: () => new RandomGeneratorV2Temp()
  };

  public static from(name: string): ISolutionGenerator<AvailablePizzaState, PizzaOrder> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
