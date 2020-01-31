import * as fs from 'fs';

export class Scanner {
  static lineDelimiter: string = '\n';
  static colDelimiter = ' ';

  private elements: Array<string>;

  constructor(fileName: string) {
    const content: string = fs.readFileSync(fileName).toString();
    // TODO handle case for last end of line
    this.elements = content
      .split(Scanner.lineDelimiter)
      .map(line => line.split(Scanner.colDelimiter))
      .flat();
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
