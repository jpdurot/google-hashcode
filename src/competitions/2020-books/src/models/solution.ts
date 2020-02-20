import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { PreConditions } from './preConditions';
import { OutputString } from '../../../../hashcode-tooling/output-string';

export class Solution implements ISolution<PreConditions> {
  constructor(public state: PreConditions) {}

  get score() {
    return 0;
  }

  toOutputString(): string {
    const output = new OutputString();

    // output.addValue(0);

    return output.string;
  }
}
