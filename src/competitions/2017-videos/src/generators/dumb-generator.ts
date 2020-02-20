import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { VideoState } from '../models/videoState';
import { CacheTopology } from '../models/cacheTopology';
import { Logger } from '../../../../hashcode-tooling/utils/logger';

export class DumbGenerator implements ISolutionGenerator<VideoState, CacheTopology> {
  static NAME = 'Dumb';
  hasNextGenerator: boolean = true;

  get name(): string {
    return DumbGenerator.NAME;
  }

  next(preConditions: VideoState): CacheTopology {
    // This is one shot
    this.hasNextGenerator = false;

    //Logger.log(preConditions);

    return new CacheTopology(preConditions);
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
