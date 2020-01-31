import { Input } from "./input";
import { ISolution } from "../../../../hashcode-tooling/i-solution";


export class Output implements ISolution<Input> {

    orderedPizzaTypes:Array<number> = [];

    getScore(preConditions: Input): number {
        if (this.orderedPizzaTypes.length == 0) return 0;
        const score:number = this.orderedPizzaTypes.map(
            (t, i) => preConditions.pizzaTypes[i]
        )
        .reduce((a, b) => a + b)

        return score > preConditions.maximumSlices ? 0 : score;
    }    
    
    toOutputString(): string {
        let result:string = '';
        result += `${this.orderedPizzaTypes.length}\n`;
        result += this.orderedPizzaTypes.join(' ') + '\n';
        return result;
    }


}