import * as fs from 'fs';
import { OutputFile } from '../output-file-utils';
import * as path from 'path';

export class SolutionGraph {
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
      const output = OutputFile.fromOutputFileName(path.join(this.resultPath, filename));

      datasets[output.inputName] = datasets[output.inputName] || {
        datasets: {}
      };

      datasets[output.inputName].datasets[output.generatorName] = datasets[output.inputName].datasets[
        output.generatorName
      ] || {
        name: output.generatorName,
        data: []
      };
      datasets[output.inputName].datasets[output.generatorName].data.push({
        x: output.modificationTime as number,
        y: output.score
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

    let graphFileName = `${this.outputDir}/graph_data.json`;
    fs.writeFileSync(graphFileName, JSON.stringify(data, null, 2));
    console.log(`Updated: ${graphFileName}`);
    console.log(`From: ${this.resultPath}`);
  }
}

const competitionName = process.argv.slice(2);

// TODO take competition path as param, make outputDir depend on the script's path
new SolutionGraph('src/hashcode-tooling/graph', `src/competitions/${competitionName}/output`).parseFiles();
