import { Scanner } from '../../../../hashcode-tooling/files/scanner';

export class Input {
  // TODO could be a Set() to remove elements
  pizzaTypes: Array<number> = [];
  maximumSlices: number;

  constructor(scanner: Scanner) {
    this.maximumSlices = scanner.nextNumber();
    const nbPizzaTypes: number = scanner.nextNumber();
    for (let i = 0; i < nbPizzaTypes; i++) {
      this.pizzaTypes.push(scanner.nextNumber());
    }
  }
}
