import { Photo } from './photo';

export class Slide {
  constructor(public photos: [Photo<'H'>] | [Photo<'V'>, Photo<'V'>]) {}

  getSlideTags(): Set<string> {
    if (this.photos.length === 1) {
      return this.photos[0].tags;
    } else {
      return new Set([...this.photos[0].tags, ...this.photos[1].tags]);
    }
  }
}
