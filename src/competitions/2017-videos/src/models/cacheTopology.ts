import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { VideoState } from './videoState';
import { OutputString } from '../../../../hashcode-tooling/output-string';
import { Video } from './video';
import { sum } from '../../../../hashcode-tooling/utils/array-util';

export class CacheTopology implements ISolution<VideoState> {
  public videosByCache: { cacheId: number; videos: Video[] }[] = [];

  constructor(public state: VideoState) {}

  get score() {
    const getTimeSaved = (endpointId: number, videoId: number): number => {
      console.log(`Trying to get endpoint ${endpointId} in ${this.state.endpoints.length}`);

      let endpoint = this.state.endpoints[endpointId];

      // caches that contain this video
      const cacheIds = this.videosByCache.filter(c => c.videos.find(v => v.id === videoId)).map(c => c.cacheId);
      const worstLatency = endpoint.latencyWithDataCenter;
      const latencies = endpoint.latencyByCache.filter(c => cacheIds.find(i => i === c.cacheId)).map(l => l.latency);

      if (latencies.length === 0) return 0;

      return worstLatency - Math.min(...latencies);
    };

    return (
      this.state.requestDescriptions.map(r => getTimeSaved(r.endpointId, r.videoId) * r.nbRequests).reduce(sum) /
      this.state.requestDescriptions.map(rd => rd.nbRequests).reduce(sum)
    );
  }

  toOutputString(): string {
    const output = new OutputString();

    output.addValue(this.videosByCache.length);

    this.videosByCache.forEach(cacheInfo => {
      output.nextLine();
      output.addValue(cacheInfo.cacheId);
      cacheInfo.videos.forEach(v => {
        output.addValue(v.id);
      });
    });

    return output.string;
  }
}
