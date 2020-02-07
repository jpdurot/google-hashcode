import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { AvailablePizzaState } from '../models/availablePizzaState';
import { PizzaOrder } from '../models/pizzaOrder';
import { randomInArray } from '../../../../hashcode-tooling/utils';
import _ = require('lodash');

export class RandomGeneratorV2Temp implements ISolutionGenerator<AvailablePizzaState, PizzaOrder> {
  static NAME = 'Random2Temp';
  iterations = 0;
  static MAX_ITERATIONS = 500;

  bestSolution: PizzaOrder | undefined = undefined;

  get name(): string {
    return RandomGeneratorV2Temp.NAME;
  }

  next(preConditions: AvailablePizzaState): PizzaOrder {
    // number that varies from 1 to 0 describing how far away we want to explore
    this.iterations++;
    console.log(Math.sqrt(this.iterations));
    const temperature = 0.2 / Math.sqrt(this.iterations);

    if (!this.bestSolution) {
      const solution = new PizzaOrder(preConditions);
      while (solution.state.availablePizzas.keys().length != 0) {
        const i = randomInArray(solution.state.availablePizzas.keys());

        solution.takePizza(i);

        if (!solution.isValid()) {
          solution.removePizza(i);
          break;
        }
      }

      this.bestSolution = solution;
    } else {
      // Start from solution
      let newSolution = _.cloneDeep(this.bestSolution);
      let numberOfChangedPizzas = newSolution.orderedPizzas.keys().length * temperature;
      console.log(
        `Iterations: ${this.iterations}, Temperature: ${temperature}, Number of changed pizzas: ${numberOfChangedPizzas}`
      );

      for (let k = 0; k < numberOfChangedPizzas; k++) {
        const j = randomInArray(newSolution.orderedPizzas.keys());
        const i = randomInArray(newSolution.state.availablePizzas.keys());

        newSolution.removePizza(j);
        newSolution.takePizza(i);
      }

      if (newSolution.isValid() && newSolution.score > this.bestSolution.score) {
        this.bestSolution = newSolution;
      }
    }

    return this.bestSolution as PizzaOrder;
  }

  hasNext(): boolean {
    return this.iterations < RandomGeneratorV2Temp.MAX_ITERATIONS;
  }
}
