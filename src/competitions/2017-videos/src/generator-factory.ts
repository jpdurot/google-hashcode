import { ISolutionGenerator } from '../../../hashcode-tooling/i-solution-generator';
import { DumbGenerator } from './generators/dumb-generator';
import { CacheTopology } from './models/cacheTopology';
import { VideoState } from './models/videoState';

export class GeneratorFactory {
  static knownGenerators = {
    [DumbGenerator.NAME.toUpperCase()]: () => new DumbGenerator()
  };

  public static from(name: string): ISolutionGenerator<VideoState, CacheTopology> {
    if (!this.knownGenerators[name.toUpperCase()]) {
      throw `Unknown generator! ${name}\nKnown generators: ${Object.keys(this.knownGenerators)}`;
    }
    return this.knownGenerators[name.toUpperCase()]();
  }
}
