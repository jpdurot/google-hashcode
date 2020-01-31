import { SolutionFinder } from '../../../hashcode-tooling/solution-finder';
import { Input } from './models/input';
import { DumbGenerator } from './generators/dumb-generator';
import { RandomGenerator } from './generators/random-generator';
import commandLineArgs = require('command-line-args');
import { GeneratorFactory } from './generators/generator-factory';

const inputDataDir: string = './src/competitions/2020-training/input';
const inputFiles: Array<string> = [
  `${inputDataDir}/a_example.in`,
  `${inputDataDir}/b_small.in`,
  `${inputDataDir}/c_medium.in`,
  `${inputDataDir}/d_quite_big.in`,
  `${inputDataDir}/e_also_big.in`
];

const optionDefinitions = [{ name: 'generator', alias: 'g', multiple: true, type: String }];

const options = commandLineArgs(optionDefinitions);

options.generator.forEach((gName: string) =>
  SolutionFinder.launchOnSeveralFiles(
    inputFiles,
    scanner => new Input(scanner),
    () => GeneratorFactory.from(gName)
  )
);
