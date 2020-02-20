export class Endpoint {
  public latencyByCache: { cacheId: number; latency: number }[] = [];

  constructor(public id: number, public latencyWithDataCenter: number) {}
}
