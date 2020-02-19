import * as fs from 'fs';
import * as path from 'path';

export class OutputFile {
  private static regexp = new RegExp(/^([^.]+)\.[^_]*_([^.]+)\.out$/);

  constructor(
    public inputName: string,
    public score: number,
    public improvementsCount: number,
    public generatorName: string,
    public modificationTime?: number
  ) {}

  public fileName(): string {
    return `${this.inputName}_${this.score}_${this.improvementsCount}_${this.generatorName}.out`;
  }

  public static fromOutputFileName(filename: string): OutputFile {
    let basename = path.basename(filename);
    const parsed = basename.match(this.regexp);
    if (!parsed) throw `Invalid file name ${filename}`;

    const inputName = parsed[1];
    const shortName = parsed[2];

    const elements = shortName.split('_');

    let i = 0;
    const score = Number(elements[i++]);
    const improvementsCount = Number(elements[i++]);
    const generator = elements[i++];

    const creationTime = fs.statSync(filename).ctime.getTime();

    return new OutputFile(inputName, score, improvementsCount, generator, creationTime);
  }
}
