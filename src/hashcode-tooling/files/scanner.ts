import * as fs from 'fs';

export class Scanner {
  static lineDelimiter: string = '\n';
  static colDelimiter = ' ';

  private currentIndex = -1;
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
    return this.currentIndex < this.elements.length;
  }

  nextString(): string {
    return this.elements[++this.currentIndex];
  }

  nextInt(): number {
    return ~~this.elements[++this.currentIndex];
  }

  nextNumber(): number {
    return Number(this.elements[++this.currentIndex]);
  }
}
