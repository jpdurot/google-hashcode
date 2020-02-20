import { SolutionFinder } from '../../../hashcode-tooling/solution-finder';
import commandLineArgs = require('command-line-args');
import { GeneratorFactory } from './generator-factory';
import { readFilesFrom } from '../../../hashcode-tooling/utils/file-utils';
import * as path from 'path';
import { PreConditions } from './models/preConditions';

// Dirty hack to get the real directory, since we know we run in /dist...
const competitionName = path.dirname(__dirname).replace(path.dirname(path.dirname(__dirname)) + '/', '');
const inputDataDir = path.join(
  ...[
    path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))),
    'src',
    'competitions',
    competitionName,
    'input'
  ]
);
let inputFiles = readFilesFrom(inputDataDir)
  .map(f => f.name)
  .filter(n => n !== '.gitkeep' && !n.endsWith('.pdf'))
  .map(n => path.join(inputDataDir, n));

const optionDefinitions = [
  { name: 'generator', alias: 'g', multiple: true, type: String },
  { name: 'file', alias: 'f', multiple: true, type: String }
];

const options = commandLineArgs(optionDefinitions);

if (options.file) {
  inputFiles = inputFiles.filter(inputFile => options.file.find((f: string) => f === path.basename(inputFile)));
}

options.generator.forEach((gName: string) =>
  SolutionFinder.launchOnSeveralFiles(
    inputFiles,
    scanner => new PreConditions(scanner),
    () => GeneratorFactory.from(gName)
  )
);
