import { AvailablePizzaState } from './availablePizzaState';
import { OutputString } from '../../../../hashcode-tooling/output-string';
import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { Dictionary } from 'typescript-collections';
import _ = require('lodash');
import { deserialize, serialize } from 'v8';

export class PizzaOrder implements ISolution<AvailablePizzaState> {
  public orderedPizzas: Dictionary<number, number> = new Dictionary<number, number>();
  private _score: number = 0;

  constructor(public state: AvailablePizzaState) {
    this.state = _.cloneDeep(state);
  }

  get score() {
    // Note the score is calculated once, not at each call
    return this._score;
  }

  set score(newScore: number) {
    this._score = newScore;
  }

  takePizza(pizzaType: number): void {
    // Note: could be more simple if score is not cached but calculated at each call to get score(), wouldn't have
    const score = this.state.availablePizzas.getValue(pizzaType) || 0;
    this.orderedPizzas.setValue(pizzaType, score);
    this.state.availablePizzas.remove(pizzaType);
    this.score += score;
  }

  removePizza(pizzaType: number): void {
    const score = this.orderedPizzas.getValue(pizzaType) || 0;
    this.state.availablePizzas.setValue(pizzaType, score);
    this.orderedPizzas.remove(pizzaType);
    this.score -= score;
  }

  toOutputString(): string {
    const output = new OutputString();
    output.addValue(this.orderedPizzas.keys().length);
    output.nextLine();
    output.addValues(this.orderedPizzas.keys());
    return output.string;
  }

  isValid(): boolean {
    return this.score <= this.state.maximumSlices;
  }

  toDumpString(): string {
    return JSON.stringify(this, null, 2);
  }

  populateFromDumpString(dumpString: string): void {
    throw 'Not working'; // TODO would need to do some complex things for Set() property
  }
}
