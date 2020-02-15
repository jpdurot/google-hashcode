export type Orientation = 'H' | 'V';

export class Photo<T extends Orientation> {
  constructor(
    public orientation: T,
    public tags: Set<string>,
    public index: number,
    public indexInSpecificArray: number
  ) {}
}
