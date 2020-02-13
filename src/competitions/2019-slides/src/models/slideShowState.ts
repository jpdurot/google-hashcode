import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Photo } from './photo';

export class SlideShowState {
  availablePhotos: Photo[];
  noOfPhotos: number;

  constructor(scanner: Scanner) {
    this.availablePhotos = [];
    this.noOfPhotos = scanner.nextNumber();
    for (let i = 0; i < this.noOfPhotos; i++) {
      const orientation = scanner.nextString();
      const noOfTags = scanner.nextNumber();
      const tags = new Set<string>();
      for (let j = 0; j < noOfTags; j++) {
        tags.add(scanner.nextString());
      }

      this.availablePhotos.push(new Photo(orientation as 'H' | 'V', tags));
    }
  }
}
