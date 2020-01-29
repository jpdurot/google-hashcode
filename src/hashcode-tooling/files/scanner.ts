import * as fs from "fs";

export class Scanner {

    private delimiter:string = '\n';

    private elements: Array<string>;

    constructor(fileName: string) {
        const content:string = fs.readFileSync(fileName).toString();
        this.elements = content.split(this.delimiter).map(line => line.split(' ')).flat();
    }

    hasNext(): boolean {
        return this.elements.length > 0;
    }

    nextString(): string {
        return this.elements.shift() + ''; 
    }

    nextNumber(): number {
        return <any>this.elements.shift() * 1;
    }
}
