import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { AvailablePizzaState } from '../models/availablePizzaState';
import { PizzaOrder } from '../models/pizzaOrder';
import _ = require('lodash');
import { PriorityQueue } from 'typescript-collections';
import { randomInArray, randomInDict } from '../../../../hashcode-tooling/utils/random-utils';

export class RandomParallelGenerator implements ISolutionGenerator<AvailablePizzaState, PizzaOrder> {
  static NAME = 'RandomParallel';
  iterations = 0;
  static MAX_ITERATIONS = 1000;
  static BEST_SOLUTIONS_COUNT = 5;

  // Sort per score ASC
  bestSolutions: PizzaOrder[] = [];

  get name(): string {
    return RandomParallelGenerator.NAME;
  }

  next(preConditions: AvailablePizzaState): PizzaOrder {
    this.iterations++;

    if (this.iterations === 1) {
      //console.log(`Init ${RandomParallelGenerator.BEST_SOLUTIONS_COUNT} solutions`);
      for (let iSolution = 0; iSolution < RandomParallelGenerator.BEST_SOLUTIONS_COUNT; iSolution++) {
        const solution = new PizzaOrder(preConditions);
        console.log('Building init solution');
        while (solution.state.availablePizzas.size() != 0) {
          const i = randomInDict(solution.state.availablePizzas);

          solution.takePizza(i);

          if (!solution.isValid()) {
            solution.removePizza(i);
            break;
          }
        }
        console.log('Done');

        this.bestSolutions.push(solution);
      }
    } else {
      //console.log(`Build new ${RandomParallelGenerator.BEST_SOLUTIONS_COUNT} solutions`);
      const newSolutions: PizzaOrder[] = [];

      this.bestSolutions.forEach(s => {
        // Start from solution
        let newSolution = _.cloneDeep(s);
        const j = randomInArray(newSolution.orderedPizzas.keys());
        const i = randomInArray(newSolution.state.availablePizzas.keys());

        // Switch one pizza with another one
        newSolution.removePizza(j);
        newSolution.takePizza(i);

        if (newSolution.isValid()) {
          newSolutions.push(newSolution);
        }
      });

      // Add all
      newSolutions.forEach(solution => this.bestSolutions.push(solution));

      // Remove all 5 worse
      this.bestSolutions = this.bestSolutions
        .sort((p1, p2) => p2.score - p1.score)
        .slice(0, RandomParallelGenerator.BEST_SOLUTIONS_COUNT - 1);
    }

    return this.bestSolutions[0] as PizzaOrder;
  }

  hasNext(): boolean {
    return this.iterations < RandomParallelGenerator.MAX_ITERATIONS;
  }
}
