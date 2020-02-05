import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Dictionary } from 'typescript-collections';

export class Input {
  // pizza id => number of slices
  pizzaTypes: Dictionary<number, number> = new Dictionary();
  maximumSlices: number;

  constructor(scanner: Scanner) {
    this.maximumSlices = scanner.nextNumber();
    const nbPizzaTypes: number = scanner.nextNumber();
    for (let i = 0; i < nbPizzaTypes; i++) {
      this.pizzaTypes.setValue(i, scanner.nextNumber());
    }
  }
}
