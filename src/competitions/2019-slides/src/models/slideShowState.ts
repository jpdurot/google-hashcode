import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Photo, Orientation } from './photo';
//import { RelationMatrix } from '../../../../hashcode-tooling/utils/relation-matrix';
import { PrimitiveRelationMatrix } from '../../../../hashcode-tooling/utils/relation-matrix-primitive';
import { RelationMatrix } from '../../../../hashcode-tooling/utils/relation-matrix';
import { Logger } from '../../../../hashcode-tooling/utils/logger';

export class SlideShowState {
  allPhotos: Photo<Orientation>[] = [];
  verticalPhotos: Photo<'V'>[] = [];
  horizontalPhotos: Photo<'H'>[] = [];
  noOfPhotos: number;
  //relationPhotoTags: RelationMatrix<number, string>[] = [];
  relationPhotoTags = new RelationMatrix<number, string>();

  //relationMatricesSize = 10000;

  constructor(scanner: Scanner) {
    this.noOfPhotos = scanner.nextNumber();
    /*for (let i = 0; i < this.noOfPhotos / this.relationMatricesSize; i++) {
      this.relationPhotoTags.push(new RelationMatrix<number, string>());
    }*/

    let percent = this.noOfPhotos / 100;

    for (let i = 0; i < this.noOfPhotos; i++) {
      const orientation = scanner.nextString() as Orientation;
      const noOfTags = scanner.nextNumber();

      const tags = new Set<string>();
      if (i % percent == 0) {
        Logger.printLn(`${i / percent}%`);
      }

      for (let j = 0; j < noOfTags; j++) {
        const tag = scanner.nextString();
        //this.relationPhotoTags[Math.floor(i / this.relationMatricesSize)].set(i, tag);
        this.relationPhotoTags.set(i, tag);
        //tags.add(tag);
      }

      const photo = new Photo(
        orientation,
        tags,
        i,
        orientation === 'H' ? this.horizontalPhotos.length : this.verticalPhotos.length
      );
      switch (photo.orientation) {
        case 'H':
          this.horizontalPhotos.push(photo as Photo<'H'>);
          break;
        case 'V':
          this.verticalPhotos.push(photo as Photo<'V'>);
          break;
        default:
      }
    }
  }
}
