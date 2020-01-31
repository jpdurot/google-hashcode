import { ISolutionGenerator } from "../../../../hashcode-tooling/i-solution-generator";
import { Input } from "../models/input";
import { Output } from "../models/output";

export class DumbGenerator implements ISolutionGenerator<Input, Output> {

    hasNextGenerator: boolean = true;
    getName(): string {
        return "Dumb";
    }    
    
    next(preConditions: Input): Output {
        const solution: Output = new Output();
        let i = 0;
        while (solution.getScore(preConditions) + preConditions.pizzaTypes[i] <= preConditions.maximumSlices) {
            solution.orderedPizzaTypes.push(i);
            i++;
        }

        this.hasNextGenerator = false;
        return solution;
    }

    hasNext():boolean {
        return this.hasNextGenerator;
    }

    
}