import { ISolution } from '../i-solution';
import { ISolutionGenerator } from '../i-solution-generator';
import { Scanner } from '../files/scanner';
import * as fs from 'fs';
import * as path from 'path';

export class SolutionGraph {
  private regexp = new RegExp(/^([^.]+)\.in_([^.]+)\.out$/);

  constructor(private outputDir: string) {}

  parseFiles(resultPath = 'src/competitions/2020-training/output'): void {
    const datasets: {
      [filename: string]: {
        datasets: {
          [generatorName: string]: {
            data: {
              x: number; // timestamp
              y: number; // score
            }[];
          };
        };
      };
    } = {};

    const files = fs.readdirSync(resultPath);

    files.forEach(filename => {
      const parsed = filename.match(this.regexp);
      if (!parsed) return;

      const inputName = parsed[1];
      const shortName = parsed[2];

      const elements = shortName.split('_');

      // ${this.shortInputName}_${this.bestScore}_${this.improvementsCount}_${this.generator.name}.out
      let i = 0;
      const score = Number(elements[i++]);
      const improvementsCount = elements[i++];
      const generator = elements[i++];

      const creationTime = fs.statSync(path.join(resultPath, filename)).ctime.getTime();

      datasets[inputName] = datasets[inputName] || {
        datasets: {}
      };

      datasets[inputName].datasets[generator] = datasets[inputName].datasets[generator] || {
        name: generator,
        data: []
      };
      datasets[inputName].datasets[generator].data.push({
        x: creationTime,
        y: score
      });

      //console.log([inputName, score, generator, creationTime]);
    });

    const data: {
      [filename: string]: {
        datasets: {
          label: string; // generator name
          data: {
            x: number; // timestamp
            y: number; // score
          }[];
        }[];
      };
    } = {};

    for (let inputFile in datasets) {
      let dataset1 = datasets[inputFile];

      const colors = ['red', 'green', 'blue', 'orange', 'black'];
      let iColor = 0;

      data[inputFile] = {
        datasets: Object.keys(dataset1.datasets).map(key => {
          const data = dataset1.datasets[key].data.sort((a, b) => a.x - b.x);
          console.log(data);
          return {
            label: key,
            data: data,
            borderColor: colors[iColor++]
          };
        })
      };
    }

    fs.writeFileSync(`${this.outputDir}/graph_data.json`, JSON.stringify(data, null, 2));
  }
}

new SolutionGraph('src/hashcode-tooling/graph').parseFiles();
