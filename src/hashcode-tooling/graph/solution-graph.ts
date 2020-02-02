import { ISolution } from '../i-solution';
import { ISolutionGenerator } from '../i-solution-generator';
import { Scanner } from '../files/scanner';
import * as fs from 'fs';
import * as path from 'path';

export class SolutionGraph {
  private regexp = new RegExp(/^([^.]+)\.in_([^.]+)\.out$/);

  constructor(private outputDir: string, private resultPath: string) {}

  parseFiles(): void {
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

    const files = fs.readdirSync(this.resultPath);

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

      const creationTime = fs.statSync(path.join(this.resultPath, filename)).ctime.getTime();

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

    const colors = ['red', 'green', 'blue', 'orange', 'black'];
    let iColor = 0;
    let dataSetColors: { [dataset: string]: string } = {};

    const getColor = (dataset: string) => {
      dataSetColors[dataset] = dataSetColors[dataset] || colors[iColor++];
      return dataSetColors[dataset];
    };

    for (let inputFile in datasets) {
      let dataset1 = datasets[inputFile];

      data[inputFile] = {
        datasets: Object.keys(dataset1.datasets)
          .map(key => {
            const data = dataset1.datasets[key].data.sort((a, b) => a.x - b.x);
            return {
              label: key,
              data: data,
              borderColor: getColor(key)
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label))
      };
    }

    fs.writeFileSync(`${this.outputDir}/graph_data.json`, JSON.stringify(data, null, 2));
  }
}

// TODO take competition path as param, make outputDir depend on the script's path
new SolutionGraph('src/hashcode-tooling/graph', 'src/competitions/2020-training/output').parseFiles();
