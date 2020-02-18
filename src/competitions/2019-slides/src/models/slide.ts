import { Photo } from './photo';

export class Slide {
  private tags: Set<string>;

  constructor(public photos: [Photo<'H'>] | [Photo<'V'>, Photo<'V'>]) {
    if (this.photos.length === 1) {
      this.tags = this.photos[0].tags;
    } else {
      this.tags = new Set([...this.photos[0].tags, ...this.photos[1].tags]);
    }
  }

  getSlideTags(): Set<string> {
    return this.tags;
  }
}
