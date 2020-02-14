import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Photo, Orientation } from './photo';
import { RelationMatrix } from '../../../../hashcode-tooling/utils/relation-matrix';

export class SlideShowState {
  availablePhotos: Photo<Orientation>[];
  noOfPhotos: number;
  relationPhotoTags = new RelationMatrix<number, string>();

  constructor(scanner: Scanner) {
    this.availablePhotos = [];
    this.noOfPhotos = scanner.nextNumber();

    for (let i = 0; i < this.noOfPhotos; i++) {
      const orientation = scanner.nextString() as Orientation;
      const noOfTags = scanner.nextNumber();
      const tags = new Set<string>();
      for (let j = 0; j < noOfTags; j++) {
        const tag = scanner.nextString();
        this.relationPhotoTags.set(i, tag);
        tags.add(tag);
      }

      this.availablePhotos.push(new Photo(orientation, tags, i));
    }
  }
}
