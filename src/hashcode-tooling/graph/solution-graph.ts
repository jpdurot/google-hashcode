import * as fs from 'fs';
import { OutputFile } from '../output-file-utils';
import * as path from 'path';
import { readFilesFrom } from '../utils/file-utils';

export class SolutionGraph {
  constructor(private outputDir: string, private resultPath: string) {}

  parseFiles(): void {
    const datasetPerInputs: {
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

    const files = readFilesFrom(this.resultPath);

    const maxScorePerInput: {
      [inputName: string]: {
        score: number;
        generator: string;
      };
    } = {};

    files.forEach(file => {
      const output = OutputFile.fromOutputFileName(path.join(this.resultPath, file.name));

      // Init
      datasetPerInputs[output.inputName] = datasetPerInputs[output.inputName] || {
        datasets: {}
      };

      datasetPerInputs[output.inputName].datasets[output.generatorName] = datasetPerInputs[output.inputName].datasets[
        output.generatorName
      ] || {
        name: output.generatorName,
        data: []
      };

      // Update
      datasetPerInputs[output.inputName].datasets[output.generatorName].data.push({
        x: output.modificationTime as number,
        y: output.score
      });

      if (maxScorePerInput[output.inputName]?.score || 0 < output.score) {
        maxScorePerInput[output.inputName] = {
          score: output.score,
          generator: output.generatorName
        };
      }

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

    for (let inputFile in datasetPerInputs) {
      let dataset1 = datasetPerInputs[inputFile];

      data[inputFile] = {
        datasets: Object.keys(dataset1.datasets)
          .map(key => {
            const data = dataset1.datasets[key].data.sort((a, b) => a.x - b.x);
            let label = key;
            if (maxScorePerInput[inputFile].generator == key) {
              // This generator has the maximum
              label += ` [${maxScorePerInput[inputFile].score}]`;
            }
            return {
              label: label,
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
