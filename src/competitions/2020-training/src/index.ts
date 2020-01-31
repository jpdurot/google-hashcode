import { SolutionFinder } from '../../../hashcode-tooling/solution-finder';
import { Input } from './models/input';
import { DumbGenerator } from './generators/dumb-generator';

const inputDataDir: string = './src/competitions/2020-training/input';
const inputFiles: Array<string> = [
  `${inputDataDir}/a_example.in`,
  `${inputDataDir}/b_small.in`,
  `${inputDataDir}/c_medium.in`,
  `${inputDataDir}/d_quite_big.in`,
  `${inputDataDir}/e_also_big.in`
];

SolutionFinder.launchOnSeveralFiles(
  inputFiles,
  scanner => new Input(scanner),
  () => new DumbGenerator()
);
