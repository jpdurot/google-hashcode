import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Dictionary } from 'typescript-collections';

export class AvailablePizzaState {
  // pizza id => number of slices
  availablePizzas: Dictionary<number, number> = new Dictionary();
  maximumSlices: number;

  constructor(scanner: Scanner) {
    this.maximumSlices = scanner.nextNumber();
    const nbPizzaTypes: number = scanner.nextNumber();
    for (let i = 0; i < nbPizzaTypes; i++) {
      this.availablePizzas.setValue(i, scanner.nextNumber());
    }
  }
}
