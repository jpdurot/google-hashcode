import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { VideoState } from '../models/videoState';
import { CacheTopology } from '../models/cacheTopology';
import { sum } from '../../../../hashcode-tooling/utils/array-util';

export class DumbGenerator implements ISolutionGenerator<VideoState, CacheTopology> {
  static NAME = 'Dumb';
  hasNextGenerator: boolean = true;

  get name(): string {
    return DumbGenerator.NAME;
  }

  next(preConditions: VideoState): CacheTopology {
    // This is one shot
    this.hasNextGenerator = false;

    let cacheTopology = new CacheTopology(preConditions);

    // Take all videos, put them in the first cache available and stop
    for (const video of preConditions.videos) {
      for (let cacheId = 0; cacheId < preConditions.nbCaches; cacheId++) {
        // In any case, initialize
        cacheTopology.videosByCache[cacheId] = cacheTopology.videosByCache[cacheId] ?? {
          cacheId,
          videos: []
        };

        const spaceAvailable =
          preConditions.cacheSize - cacheTopology.videosByCache[cacheId].videos.map(v => v.size).reduce(sum, 0);

        if (spaceAvailable >= video.size) {
          cacheTopology.videosByCache[cacheId].videos.push(video);
          // ---------------- Put video only in one cache
          break;
        }
      }
    }

    return cacheTopology;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
