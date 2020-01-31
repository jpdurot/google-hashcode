import { Scanner } from "../../../../hashcode-tooling/files/scanner";

export class Input {

    pizzaTypes:Array<number> = [];
    maximumSlices:number;

    constructor(scanner:Scanner) {
        this.maximumSlices = scanner.nextNumber();
        const nbPizzaTypes:number = scanner.nextNumber();
        for (let i=0; i< nbPizzaTypes; i++) {
            this.pizzaTypes.push(scanner.nextNumber());
        }
    }
}