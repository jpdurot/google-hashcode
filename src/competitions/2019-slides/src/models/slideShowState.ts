import { Scanner } from '../../../../hashcode-tooling/files/scanner';
import { Photo, Orientation } from './photo';
import { Logger } from '../../../../hashcode-tooling/utils/logger';

export class SlideShowState {
  allPhotos: Photo<Orientation>[] = [];
  verticalPhotos: Photo<'V'>[] = [];
  horizontalPhotos: Photo<'H'>[] = [];
  noOfPhotos: number;

  constructor(scanner: Scanner) {
    this.noOfPhotos = scanner.nextNumber();

    let percent = this.noOfPhotos / 100;

    for (let i = 0; i < this.noOfPhotos; i++) {
      const orientation = scanner.nextString() as Orientation;
      const noOfTags = scanner.nextNumber();

      const tags = new Set<string>();
      // if (i % percent == 0) {
      //   Logger.printLn(`${i / percent}%`);
      // }

      for (let j = 0; j < noOfTags; j++) {
        const tag = scanner.nextString();
        tags.add(tag);
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

      this.allPhotos.push(photo);
    }
  }
}
