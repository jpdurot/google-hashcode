import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from '../models/slideShowSolution';
import { Orientation, Photo } from '../models/photo';
import { Slide } from '../models/slide';
import { randIntMax } from '../../../../hashcode-tooling/utils/random-utils';
import { removeFromArray } from '../../../../hashcode-tooling/utils/array-util';
import { IRelationMatrix } from '../../../../hashcode-tooling/utils/i-relation-matrix';
import { PrimitiveRelationMatrix } from './../../../../hashcode-tooling/utils/relation-matrix-primitive';

export class IntersectionGenerator implements ISolutionGenerator<SlideShowState, SlideShowSolution> {
  /** ATENTION: this generator is only theoretical, it doesn't complete the task in feasible time
   * calculating the intersection of tags between one photo and all the others take too much time,
   * even with the relation matrix approach. It does finish for problems A and C and finds a 5 times
   * better result for the C problem
   */
  static NAME = 'IntersectionGenerator';
  hasNextGenerator: boolean = true;
  remainingVerticalPhotos: Photo<'V'>[] = [];
  remainingHorizontalPhotos: Photo<'H'>[] = [];
  _photoTagsRelation: IRelationMatrix<number, string> | undefined;

  get name(): string {
    return IntersectionGenerator.NAME;
  }

  get photoTagsRelation() {
    return this._photoTagsRelation as IRelationMatrix<number, string>;
  }

  next(preConditions: SlideShowState): SlideShowSolution {
    // This is one shot
    this.hasNextGenerator = false;

    this._photoTagsRelation = new PrimitiveRelationMatrix<number, string>();
    preConditions.allPhotos.forEach(photo => photo.tags.forEach(tag => this._photoTagsRelation?.set(photo.index, tag)));

    const solution = new SlideShowSolution(preConditions);
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
    // Pick randomly vertical or horizontal, except if there is only vertical or horizontal left
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
      // Previous slide only has one horizontal photo
      const firstPhoto = this.takeBiggestIntersectionPhoto(previousSlide.photos[0], 'V');
      const secondPhoto = this.takeSmallestIntersectionPhoto(firstPhoto, 'V');
      return new Slide([firstPhoto, secondPhoto]);
    } else {
      // Previous slide has two vertical photos
      // TODO I don't understand why we take the second photo as reference, we should take all tags from the two photos
      const firstPhoto = this.takeBiggestIntersectionPhoto(previousSlide.photos[1], 'V');
      const secondPhoto = this.takeSmallestIntersectionPhoto(firstPhoto, 'V');
      return new Slide([firstPhoto, secondPhoto]);
    }
  }

  takeIntersectionHorizontalSlide(previousSlide: Slide): Slide {
    if (previousSlide.photos.length === 1) {
      // Previous slide only has one horizontal photo
      return new Slide([this.takeMedianIntersectionPhoto(previousSlide.photos[0], 'H')]);
    } else {
      // Previous slide has two vertical photos
      // TODO I don't understand why we take the second photo as reference, we should take all tags from the two photos
      return new Slide([this.takeBiggestIntersectionPhoto(previousSlide.photos[1], 'H')]);
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
    const remainingInterestingPhotos: Photo<'H' | 'V'>[] =
      orientation === 'H' ? this.remainingHorizontalPhotos : this.remainingVerticalPhotos;

    // Calculate intersection between all remaining photos and this one
    let remainingIntersectionSizes = this.getIntersectionsWith(remainingInterestingPhotos, photo);

    let maxIntersectionValue = Number.NEGATIVE_INFINITY;
    let maxIntersectionIndex = -1;
    for (let i = 0; i < remainingIntersectionSizes.length; i++) {
      if (remainingIntersectionSizes[i].value > maxIntersectionValue) {
        maxIntersectionValue = remainingIntersectionSizes[i].value;
        maxIntersectionIndex = i;
      }
    }

    return this.takePhoto<T>(maxIntersectionIndex, orientation);
  }

  takeMedianIntersectionPhoto<T extends Orientation>(photo: Photo<Orientation>, orientation: T): Photo<T> {
    const remainingInterestingPhotos: Photo<'H' | 'V'>[] =
      orientation === 'H' ? this.remainingHorizontalPhotos : this.remainingVerticalPhotos;

    const remainingIntersectionSizes = this.getIntersectionsWith(remainingInterestingPhotos, photo).sort(
      (a, b) => a.value - b.value
    );

    const medianIntersection = remainingIntersectionSizes[Math.floor(remainingIntersectionSizes.length / 2)];

    return this.takePhoto<T>(medianIntersection.index, orientation);
  }

  takeSmallestIntersectionPhoto<T extends Orientation>(photo: Photo<Orientation>, orientation: T): Photo<T> {
    const remainingInterestingPhotos =
      orientation === 'H'
        ? (this.remainingHorizontalPhotos as Photo<T>[])
        : (this.remainingVerticalPhotos as Photo<T>[]);

    let remainingIntersectionSizes = this.getIntersectionsWith(remainingInterestingPhotos, photo);

    let minIntersectionValue = Number.POSITIVE_INFINITY;
    let minIntersectionIndex = -1;
    for (let i = 0; i < remainingIntersectionSizes.length; i++) {
      if (remainingIntersectionSizes[i].value < minIntersectionValue) {
        minIntersectionValue = remainingIntersectionSizes[i].value;
        minIntersectionIndex = i;
      }
    }

    return this.takePhoto<T>(minIntersectionIndex, orientation);
  }

  // Calculate intersection between all remaining photos and this one
  private getIntersectionsWith(remainingInterestingPhotos: Photo<'H' | 'V'>[], photo: Photo<Orientation>) {
    let map = remainingInterestingPhotos.map((remainingPhoto: Photo<Orientation>, index) => ({
      value: this.photoTagsRelation
        .getRelationLineIntersection(photo.index, remainingPhoto.index)
        .reduce((a, b) => a + b),
      index
    }));
    return map;
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

    return selectedPhoto;
  }

  takeRandomVerticalPhoto(): Photo<'V'> {
    let randomIndex = randIntMax(this.remainingVerticalPhotos.length - 1);
    let selectedPhoto = this.remainingVerticalPhotos[randomIndex];

    removeFromArray(this.remainingVerticalPhotos, randomIndex);

    return selectedPhoto;
  }

  takeRandomHorizontalPhoto(): Photo<'H'> {
    let randomIndex = randIntMax(this.remainingHorizontalPhotos.length - 1);
    let selectedPhoto = this.remainingHorizontalPhotos[randomIndex];

    removeFromArray(this.remainingHorizontalPhotos, randomIndex);

    return selectedPhoto;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
