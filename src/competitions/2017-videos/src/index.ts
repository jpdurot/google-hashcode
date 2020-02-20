import * as fs from 'fs';
import { SolutionFinder } from '../../../hashcode-tooling/solution-finder';
import commandLineArgs = require('command-line-args');
import { GeneratorFactory } from './generator-factory';
import { VideoState } from './models/videoState';
import { readFilesFrom } from '../../../hashcode-tooling/utils/file-utils';
import * as path from 'path';

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
const inputFiles = readFilesFrom(inputDataDir)
  .map(f => f.name)
  .filter(n => n !== '.gitkeep' && !n.endsWith('.pdf'))
  .map(n => path.join(inputDataDir, n));

const optionDefinitions = [{ name: 'generator', alias: 'g', multiple: true, type: String }];

const options = commandLineArgs(optionDefinitions);

options.generator.forEach((gName: string) =>
  SolutionFinder.launchOnSeveralFiles(
    inputFiles,
    scanner => new VideoState(scanner),
    () => GeneratorFactory.from(gName)
  )
);
