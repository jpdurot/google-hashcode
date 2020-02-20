import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Video } from './video';
import { Endpoint } from './endpoint';
import { RequestDescription } from './request-description';

export class VideoState {
  public nbVideos: number;
  public nbEndpoints: number;
  public nbRequestDescriptions: number;
  public nbCaches: number;
  public cacheSize: number;

  public videos: Video[] = [];
  public endpoints: Endpoint[] = [];
  public requestDescriptions: RequestDescription[] = [];

  constructor(scanner: Scanner) {
    this.nbVideos = scanner.nextInt();
    this.nbEndpoints = scanner.nextInt();
    this.nbRequestDescriptions = scanner.nextInt();
    this.nbCaches = scanner.nextInt();
    this.cacheSize = scanner.nextInt();

    for (let i = 0; i < this.nbVideos; i++) {
      this.videos.push(new Video(i, scanner.nextInt()));
    }

    for (let i = 0; i < this.nbEndpoints; i++) {
      let endpoint = new Endpoint(i, scanner.nextInt());
      this.endpoints.push(endpoint);
      const cachesCount = scanner.nextInt();
      for (let j = 0; j < cachesCount; j++) {
        endpoint.latencyByCache.push({ cacheId: scanner.nextInt(), latency: scanner.nextInt() });
      }
    }

    for (let i = 0; i < this.nbRequestDescriptions; i++) {
      const videoId = scanner.nextInt();
      const endpointId = scanner.nextInt();
      const requestCount = scanner.nextInt();
      const requestDescription = new RequestDescription(i, requestCount, videoId, endpointId);
      this.requestDescriptions.push(requestDescription);
    }
  }
}
