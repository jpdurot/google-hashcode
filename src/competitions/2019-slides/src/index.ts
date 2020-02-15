import { SolutionFinder } from '../../../hashcode-tooling/solution-finder';
import commandLineArgs = require('command-line-args');
import { GeneratorFactory } from './generators/generator-factory';
import { SlideShowState } from './models/slideShowState';

const inputDataDir: string = './src/competitions/2019-slides/input';
const inputFiles: Array<string> = [
  `${inputDataDir}/a_example.txt`,
  `${inputDataDir}/b_lovely_landscapes.txt`,
  `${inputDataDir}/c_memorable_moments.txt`,
  `${inputDataDir}/d_pet_pictures.txt`,
  `${inputDataDir}/e_shiny_selfies.txt`
];

const optionDefinitions = [{ name: 'generator', alias: 'g', multiple: true, type: String }];

const options = commandLineArgs(optionDefinitions);

options.generator.forEach((gName: string) =>
  SolutionFinder.launchOnSeveralFiles(
    inputFiles,
    scanner => new SlideShowState(scanner),
    () => GeneratorFactory.from(gName)
  )
);
