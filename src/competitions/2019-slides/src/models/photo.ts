type Orientation = 'H' | 'V';

export class Photo<T extends Orientation> {
  constructor(public orientation: T, public tags: Set<string>) {}
}
