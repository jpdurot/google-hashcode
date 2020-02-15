import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Photo, Orientation } from './photo';
//import { RelationMatrix } from '../../../../hashcode-tooling/utils/relation-matrix';

export class SlideShowState {
  verticalPhotos: Photo<'V'>[] = [];
  horizontalPhotos: Photo<'H'>[] = [];
  noOfPhotos: number;
  //relationPhotoTags: RelationMatrix<number, string>[] = [];

  //relationMatricesSize = 10000;

  constructor(scanner: Scanner) {
    this.noOfPhotos = scanner.nextNumber();
    /*for (let i = 0; i < this.noOfPhotos / this.relationMatricesSize; i++) {
      this.relationPhotoTags.push(new RelationMatrix<number, string>());
    }*/

    for (let i = 0; i < this.noOfPhotos; i++) {
      const orientation = scanner.nextString() as Orientation;
      const noOfTags = scanner.nextNumber();
      const tags = new Set<string>();

      // console.log(i); // to have an idea of parsing progress

      for (let j = 0; j < noOfTags; j++) {
        const tag = scanner.nextString();
        //this.relationPhotoTags[Math.floor(i / this.relationMatricesSize)].set(i, tag);
        tags.add(tag);
      }

      switch (orientation) {
        case 'H':
          this.horizontalPhotos.push(new Photo(orientation, tags, i));
          break;
        case 'V':
          this.verticalPhotos.push(new Photo(orientation, tags, i));
          break;
        default:
      }
    }
  }
}
