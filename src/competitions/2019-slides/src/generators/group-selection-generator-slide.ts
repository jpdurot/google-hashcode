import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from '../models/slideShowSolution';
import { Photo, Orientation } from '../models/photo';
import { Slide } from '../models/slide';
import { randIntMax } from '../../../../hashcode-tooling/utils/random-utils';
import { removeFromArray } from '../../../../hashcode-tooling/utils/array-util';
import { intersection, difference } from '../../../../hashcode-tooling/utils/set-util';

type SearchGroup = Slide[];

export class GroupSelectionGeneratorSlide implements ISolutionGenerator<SlideShowState, SlideShowSolution> {
  static NAME = 'GroupSelectionGeneratorSlide';
  hasNextGenerator: boolean = true;
  remainingPhotos: Photo<Orientation>[] = [];
  remainingVerticalPhotos: Photo<'V'>[] = [];
  remainingHorizontalPhotos: Photo<'H'>[] = [];

  previousSlideIndex = -1;

  readonly GROUP_SIZE = 2000;

  get name(): string {
    return GroupSelectionGeneratorSlide.NAME;
  }

  next(preConditions: SlideShowState): SlideShowSolution {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new SlideShowSolution(preConditions);
    this.remainingPhotos = [...preConditions.allPhotos];
    this.remainingVerticalPhotos = [...preConditions.verticalPhotos];
    this.remainingHorizontalPhotos = [...preConditions.horizontalPhotos];

    let firstSlide = this.generateRandomSlide();
    solution.addSlide(firstSlide);
    let nextSlide = firstSlide;
    let searchGroup = this.generateSearchGroup();
    while (searchGroup.length > 0) {
      console.log(
        `Remaining Horizontal Photos: ${this.remainingHorizontalPhotos.length}, Remaining Vertical Photos: ${this.remainingVerticalPhotos.length}`
      );
      nextSlide = this.takeNextSlide(nextSlide, searchGroup);
      while (searchGroup.length > 1) {
        solution.addSlide(nextSlide);
        nextSlide = this.takeNextSlide(nextSlide, searchGroup);
      }
      searchGroup = this.generateSearchGroup();
    }

    return solution;
  }

  getSlideTransitionValue(firstSlide: Slide, secondSlide: Slide): number {
    const firstSlideUniqueTags = difference(firstSlide.getSlideTags(), secondSlide.getSlideTags()).size;
    const slidesIntersectionsTags = intersection(firstSlide.getSlideTags(), secondSlide.getSlideTags()).size;
    const secondSlideUniqueTags = difference(secondSlide.getSlideTags(), firstSlide.getSlideTags()).size;

    return Math.min(firstSlideUniqueTags, slidesIntersectionsTags, secondSlideUniqueTags);
  }

  generateSearchGroup(): SearchGroup {
    let i = 0;
    let group: SearchGroup = [];
    while (
      i < this.GROUP_SIZE &&
      (this.remainingVerticalPhotos.length >= 2 || this.remainingHorizontalPhotos.length >= 1)
    ) {
      ++i;
      if (this.remainingVerticalPhotos.length < 2 && this.remainingHorizontalPhotos.length >= 1) {
        group.push(new Slide([this.takeRandomHorizontalPhoto()]));
      } else if (this.remainingVerticalPhotos.length >= 2 && this.remainingHorizontalPhotos.length < 1) {
        group.push(new Slide([this.takeRandomVerticalPhoto(), this.takeRandomVerticalPhoto()]));
      } else if (Math.random() > 0.5) {
        group.push(new Slide([this.takeRandomHorizontalPhoto()]));
      } else {
        group.push(new Slide([this.takeRandomVerticalPhoto(), this.takeRandomVerticalPhoto()]));
      }
    }
    // this is where the vertical slide formation can be improved

    return group;
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

  takeNextSlide(previousSlide: Slide, searchGroup: SearchGroup): Slide {
    let nextSlide = this.takeMaxValueSlide(previousSlide, searchGroup);

    return nextSlide;
  }

  takeMaxValueSlide(previousSlide: Slide, searchGroup: SearchGroup): Slide {
    const slide = this.takeBiggestValueSlide(previousSlide, searchGroup);
    return slide;
  }

  takeBiggestValueSlide(previousSlide: Slide, searchGroup: SearchGroup): Slide {
    let remainingSlideValues = searchGroup.map((remainingSlide, remainingPhotoIndex) => {
      const intersectionSize = intersection(previousSlide.getSlideTags(), remainingSlide.getSlideTags()).size;
      return Math.min(
        previousSlide.getSlideTags().size - intersectionSize,
        intersectionSize,
        remainingSlide.getSlideTags().size - intersectionSize
      );
    });

    let maxValueValue = Number.NEGATIVE_INFINITY;
    let maxValueIndex = -1;
    // we don't iterate up to the last slide because we know the last one is the previous one
    for (let i = 0; i < remainingSlideValues.length - 1; i++) {
      if (remainingSlideValues[i] > maxValueValue) {
        maxValueValue = remainingSlideValues[i];
        maxValueIndex = i;
      }
    }

    let selectedSlide = searchGroup[maxValueIndex];
    removeFromArray(searchGroup, maxValueIndex);

    return selectedSlide;
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
