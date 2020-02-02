export class OutputString {
  private buffer: string | null = null;
  private values: any[] = [];

  constructor(private delimiter = ' ', private lineDelimiter = '\n') {}

  get string(): string {
    if (this.values.length != 0) {
      this.nextLine();
    }
    // TODO add last end of line?
    return this.buffer || '';
  }

  public addValue(value: any) {
    this.values.push(value);
  }

  private dumpValues() {
    this.buffer += this.values.join(this.delimiter);
    this.values = [];
  }

  public addValues(values: any[]) {
    this.values.push(...values);
  }

  public nextLine() {
    if (!this.buffer) {
      this.buffer = '';
    } else {
      this.buffer += this.lineDelimiter;
    }

    this.dumpValues();
  }
}
