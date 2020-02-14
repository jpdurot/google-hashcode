import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Photo, Orientation } from './photo';

export class SlideShowState {
  availablePhotos: Photo<Orientation>[];
  noOfPhotos: number;

  constructor(scanner: Scanner) {
    this.availablePhotos = [];
    this.noOfPhotos = scanner.nextNumber();
    for (let i = 0; i < this.noOfPhotos; i++) {
      const orientation = scanner.nextString() as Orientation;
      const noOfTags = scanner.nextNumber();
      const tags = new Set<string>();
      for (let j = 0; j < noOfTags; j++) {
        tags.add(scanner.nextString());
      }

      this.availablePhotos.push(new Photo(orientation, tags, i));
    }
  }
}
