import { SolutionFinder } from '../../../hashcode-tooling/solution-finder';
import commandLineArgs = require('command-line-args');
import { GeneratorFactory } from './generator-factory';
import { VideoState } from './models/videoState';

const inputDataDir: string = './src/competitions/2017-videos/input';
const inputFiles: Array<string> = [
  `${inputDataDir}/kittens.in`
  /*
  `${inputDataDir}/me_at_the_zoo.in`,
  `${inputDataDir}/trending_today.in`,
  `${inputDataDir}/videos_worth_spreading.in`
  
   */
];

const optionDefinitions = [{ name: 'generator', alias: 'g', multiple: true, type: String }];

const options = commandLineArgs(optionDefinitions);

options.generator.forEach((gName: string) =>
  SolutionFinder.launchOnSeveralFiles(
    inputFiles,
    scanner => new VideoState(scanner),
    () => GeneratorFactory.from(gName)
  )
);
