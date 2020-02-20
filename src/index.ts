import commandLineArgs = require('command-line-args');
import * as path from 'path';
import { readFilesFrom } from './hashcode-tooling/utils/file-utils';

const concurrently = require('concurrently');

const optionDefinitions = [
  { name: 'competition', alias: 'c', multiple: false, type: String },
  { name: 'generator', alias: 'g', multiple: true, type: String },
  { name: 'file', alias: 'f', multiple: true, type: String }
];

const options = commandLineArgs(optionDefinitions);

const competitionName = options.competition;

// Dirty hack to get the real directory, since we know we run in /dist...
const inputDataDir = path.join(...[path.dirname(__dirname), 'src', 'competitions', competitionName, 'input']);

let inputFiles = readFilesFrom(inputDataDir)
  .map(f => f.name)
  .filter(n => n !== '.gitkeep' && !n.endsWith('.pdf'));

if (options.file) {
  inputFiles = inputFiles.filter(inputFile => options.file.find((f: string) => f === inputFile));
}

const generators = options.generator.map((g: string) => `-g ${g}`);

const colors = ['red', 'blue', 'green', 'yellow'];

let colorIndex = 0;

const commands = inputFiles.map(file => ({
  command: `node dist/competitions/${competitionName}/src/index.js ${generators} -f ${file}`,
  name: file,
  prefixColor: colors[colorIndex++]
}));

concurrently(commands);
