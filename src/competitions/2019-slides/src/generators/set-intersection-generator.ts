import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from '../models/slideShowSolution';
import { Orientation, Photo } from '../models/photo';
import { Slide } from '../models/slide';
import { randIntMax } from '../../../../hashcode-tooling/utils/random-utils';
import { removeFromArray } from '../../../../hashcode-tooling/utils/array-util';
import { intersection } from '../../../../hashcode-tooling/utils/set-util';
import { IRelationMatrix } from '../../../../hashcode-tooling/utils/i-relation-matrix';

export class SetIntersectionGenerator implements ISolutionGenerator<SlideShowState, SlideShowSolution> {
  /** ATENTION: this generator is only theoretical, it doesn't complete the task in feasible time
   * calculating the intersection of tags between one photo and all the others take too much time,
   * even with the relation matrix approach. It does finishes for problems A and C and finds a 5 times
   * better result for the C problem
   */
  static NAME = 'SetIntersectionGenerator';
  hasNextGenerator: boolean = true;
  remainingPhotos: Photo<Orientation>[] = [];
  remainingVerticalPhotos: Photo<'V'>[] = [];
  remainingHorizontalPhotos: Photo<'H'>[] = [];
  _photoTagsRelation: IRelationMatrix<number, string> | undefined;

  get name(): string {
    return SetIntersectionGenerator.NAME;
  }

  get photoTagsRelation() {
    return this._photoTagsRelation as IRelationMatrix<number, string>;
  }

  next(preConditions: SlideShowState): SlideShowSolution {
    // This is one shot
    this.hasNextGenerator = false;

    this._photoTagsRelation = preConditions.relationPhotoTags;
    const solution = new SlideShowSolution(preConditions);
    this.remainingPhotos = [...preConditions.allPhotos];
    this.remainingVerticalPhotos = [...preConditions.verticalPhotos];
    this.remainingHorizontalPhotos = [...preConditions.horizontalPhotos];

    let firstSlide = this.generateRandomSlide();
    solution.addSlide(firstSlide);

    let nextSlide = this.generateNextSlide(firstSlide);
    while (this.remainingVerticalPhotos.length >= 2 || this.remainingHorizontalPhotos.length >= 1) {
      console.log(
        `Remaining Vertical Photos: ${this.remainingVerticalPhotos.length}, Remaining Horizontal Photos: ${this.remainingHorizontalPhotos.length}`
      );
      solution.addSlide(nextSlide);
      nextSlide = this.generateNextSlide(nextSlide);
    }

    return solution;
  }

  generateRandomSlide(): Slide {
    if (this.remainingVerticalPhotos.length < 2 && this.remainingHorizontalPhotos.length >= 1) {
      return this.takeRandomHorizontalSlide();
    } else if (this.remainingVerticalPhotos.length >= 2 && this.remainingHorizontalPhotos.length < 1) {
      return this.takeRandomVerticalSlide();
    } else if (Math.random() > 0.5) {
      return this.takeRandomHorizontalSlide();
    } else {
      return this.takeRandomVerticalSlide();
    }
  }

  generateNextSlide(previousSlide: Slide): Slide {
    if (this.remainingVerticalPhotos.length < 2 && this.remainingHorizontalPhotos.length >= 1) {
      return this.takeIntersectionHorizontalSlide(previousSlide);
    } else if (this.remainingVerticalPhotos.length >= 2 && this.remainingHorizontalPhotos.length < 1) {
      return this.takeIntersectionVerticalSlide(previousSlide);
    } else if (Math.random() > 0.5) {
      return this.takeIntersectionHorizontalSlide(previousSlide);
    } else {
      return this.takeIntersectionVerticalSlide(previousSlide);
    }
  }

  takeIntersectionVerticalSlide(previousSlide: Slide): Slide {
    if (previousSlide.photos.length === 1) {
      const firstPhoto = this.takeBiggestIntersectionPhoto<'V'>(previousSlide.photos[0], 'V');
      const secondPhoto = this.takeSmallestIntersectionPhoto<'V'>(firstPhoto, 'V');
      return new Slide([firstPhoto, secondPhoto]);
    } else {
      const firstPhoto = this.takeBiggestIntersectionPhoto<'V'>(previousSlide.photos[1], 'V');
      const secondPhoto = this.takeSmallestIntersectionPhoto<'V'>(firstPhoto, 'V');
      return new Slide([firstPhoto, secondPhoto]);
    }
  }

  takeIntersectionHorizontalSlide(previousSlide: Slide): Slide {
    if (previousSlide.photos.length === 1) {
      return new Slide([this.takeMedianIntersectionPhoto<'H'>(previousSlide.photos[0], 'H')]);
    } else {
      return new Slide([this.takeBiggestIntersectionPhoto<'H'>(previousSlide.photos[1], 'H')]);
    }
  }

  takeRandomVerticalSlide(): Slide {
    let firstPhoto = this.takeRandomVerticalPhoto();
    let secondPhoto = this.takeRandomVerticalPhoto();
    return new Slide([firstPhoto, secondPhoto]);
  }

  takeRandomHorizontalSlide(): Slide {
    let selectedPhoto = this.takeRandomHorizontalPhoto();
    return new Slide([selectedPhoto]);
  }

  takeBiggestIntersectionPhoto<T extends Orientation>(photo: Photo<Orientation>, orientation: T): Photo<T> {
    const remainingInterestingPhotos =
      orientation === 'H'
        ? (this.remainingHorizontalPhotos as Photo<T>[])
        : (this.remainingVerticalPhotos as Photo<T>[]);

    let remainingIntersectionSizes = remainingInterestingPhotos.map(
      (remainingPhoto: Photo<Orientation>) => intersection(photo.tags, remainingPhoto.tags).size
    );

    let maxIntersectionValue = Number.NEGATIVE_INFINITY;
    let maxIntersectionIndex = -1;
    for (let i = 0; i < remainingIntersectionSizes.length; i++) {
      if (remainingIntersectionSizes[i] > maxIntersectionValue) {
        maxIntersectionValue = remainingIntersectionSizes[i];
        maxIntersectionIndex = i;
      }
    }

    return this.takePhoto<T>(maxIntersectionIndex, orientation);
  }

  takeMedianIntersectionPhoto<T extends Orientation>(photo: Photo<Orientation>, orientation: T): Photo<T> {
    const remainingInterestingPhotos =
      orientation === 'H'
        ? (this.remainingHorizontalPhotos as Photo<T>[])
        : (this.remainingVerticalPhotos as Photo<T>[]);

    const remainingIntersectionSizes = remainingInterestingPhotos
      .map((remainingPhoto: Photo<Orientation>, index) => {
        return {
          value: intersection(photo.tags, remainingPhoto.tags).size,
          index
        };
      })
      .sort((a, b) => a.value - b.value);

    const medianIntersection = remainingIntersectionSizes[Math.floor(remainingIntersectionSizes.length / 2)];

    return this.takePhoto<T>(medianIntersection.index, orientation);
  }

  takeSmallestIntersectionPhoto<T extends Orientation>(photo: Photo<Orientation>, orientation: T): Photo<T> {
    const remainingInterestingPhotos =
      orientation === 'H'
        ? (this.remainingHorizontalPhotos as Photo<T>[])
        : (this.remainingVerticalPhotos as Photo<T>[]);

    let remainingIntersectionSizes = remainingInterestingPhotos.map(
      (remainingPhoto: Photo<Orientation>) => intersection(photo.tags, remainingPhoto.tags).size
    );

    let minIntersectionValue = Number.POSITIVE_INFINITY;
    let minIntersectionIndex = -1;
    for (let i = 0; i < remainingIntersectionSizes.length; i++) {
      if (remainingIntersectionSizes[i] < minIntersectionValue) {
        minIntersectionValue = remainingIntersectionSizes[i];
        minIntersectionIndex = i;
      }
    }

    return this.takePhoto<T>(minIntersectionIndex, orientation);
  }

  takePhoto<T extends Orientation>(indexInSpecificArray: number, orientation: T): Photo<T> {
    let selectedPhoto: Photo<T>;

    if (orientation === 'H') {
      selectedPhoto = this.remainingHorizontalPhotos[indexInSpecificArray] as Photo<T>;
      removeFromArray(this.remainingHorizontalPhotos, indexInSpecificArray);
    } else {
      selectedPhoto = this.remainingVerticalPhotos[indexInSpecificArray] as Photo<T>;
      removeFromArray(this.remainingVerticalPhotos, indexInSpecificArray);
    }

    removeFromArray(this.remainingPhotos, selectedPhoto.index);
    return selectedPhoto;
  }

  takeRandomPhoto(): Photo<Orientation> {
    let randomIndex = randIntMax(this.remainingPhotos.length - 1);
    let selectedPhoto = this.remainingPhotos[randomIndex];

    removeFromArray(this.remainingPhotos, randomIndex);

    selectedPhoto.orientation === 'H'
      ? removeFromArray(this.remainingHorizontalPhotos, selectedPhoto.indexInSpecificArray)
      : removeFromArray(this.remainingVerticalPhotos, selectedPhoto.indexInSpecificArray);

    return selectedPhoto;
  }

  takeRandomVerticalPhoto(): Photo<'V'> {
    let randomIndex = randIntMax(this.remainingVerticalPhotos.length - 1);
    let selectedPhoto = this.remainingVerticalPhotos[randomIndex];

    removeFromArray(this.remainingVerticalPhotos, randomIndex);
    removeFromArray(this.remainingPhotos, selectedPhoto.index);

    return selectedPhoto;
  }

  takeRandomHorizontalPhoto(): Photo<'H'> {
    let randomIndex = randIntMax(this.remainingHorizontalPhotos.length - 1);
    let selectedPhoto = this.remainingHorizontalPhotos[randomIndex];

    removeFromArray(this.remainingHorizontalPhotos, randomIndex);
    removeFromArray(this.remainingPhotos, selectedPhoto.index);

    return selectedPhoto;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
