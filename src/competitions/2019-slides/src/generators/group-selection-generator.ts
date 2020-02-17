import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from '../models/slideShowSolution';
import { Photo, Orientation } from '../models/photo';
import { Slide } from '../models/slide';
import { randIntMax } from '../../../../hashcode-tooling/utils/random-utils';
import { removeFromArray } from '../../../../hashcode-tooling/utils/array-util';
import { PrimitiveRelationMatrix } from '../../../../hashcode-tooling/utils/relation-matrix-primitive';
import { intersection, union } from '../../../../hashcode-tooling/utils/set-util';
import { difference } from './../../../../hashcode-tooling/utils/set-util';

type SearchGroupPhoto<T extends Orientation> = {
  searchGroupIndex: number;
  photo: Photo<T>;
};

export class GroupIntersectionGenerator implements ISolutionGenerator<SlideShowState, SlideShowSolution> {
  static NAME = 'GroupSelectionGenerator';
  hasNextGenerator: boolean = true;
  remainingPhotos: Photo<Orientation>[] = [];
  remainingVerticalPhotos: Photo<'V'>[] = [];
  remainingHorizontalPhotos: Photo<'H'>[] = [];
  photoTagsRelation = new PrimitiveRelationMatrix<number, string>();

  readonly GROUP_SIZE = 100;

  get name(): string {
    return GroupIntersectionGenerator.NAME;
  }

  next(preConditions: SlideShowState): SlideShowSolution {
    // This is one shot
    this.hasNextGenerator = false;

    this.photoTagsRelation = preConditions.relationPhotoTags;
    const solution = new SlideShowSolution(preConditions);
    this.remainingPhotos = [...preConditions.allPhotos];
    this.remainingVerticalPhotos = [...preConditions.verticalPhotos];
    this.remainingHorizontalPhotos = [...preConditions.horizontalPhotos];

    let firstSlide = this.generateRandomSlide();
    solution.addSlide(firstSlide);

    let searchGroup: Photo<Orientation>[] = this.generateSearchGroup();
    while (searchGroup.length > 1) {
      console.log(`Remaining Photos: ${this.remainingPhotos.length}`);

      let nextSlide = this.generateNextSlide(firstSlide, searchGroup);
      while (nextSlide != null) {
        solution.addSlide(nextSlide);
        nextSlide = this.generateNextSlide(nextSlide, searchGroup);
      }
      searchGroup = this.generateSearchGroup();
    }

    return solution;
  }

  generateSearchGroup(): Photo<Orientation>[] {
    let i = 0;
    let group: Photo<Orientation>[] = [];
    while (i < this.GROUP_SIZE && this.remainingPhotos.length > 0) {
      ++i;
      group.push(this.takeRandomPhoto());
    }

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

  generateNextSlide(previousSlide: Slide, searchGroup: Photo<Orientation>[]): Slide | null {
    let remainingHorizontalPhotos: SearchGroupPhoto<'H'>[] = [];
    let remainingVerticalPhotos: SearchGroupPhoto<'V'>[] = [];

    searchGroup.forEach((p, searchGroupIndex) => {
      if (p.orientation === 'H') {
        remainingHorizontalPhotos.push({ searchGroupIndex, photo: p as Photo<'H'> });
      } else {
        remainingVerticalPhotos.push({ searchGroupIndex, photo: p as Photo<'V'> });
      }
    });

    if (remainingVerticalPhotos.length === 1) {
      this.remainingPhotos.push(remainingVerticalPhotos[0].photo);
      // if there's only one vertical photo in the group, put it back in the pool
    }
    if (remainingHorizontalPhotos.length < 1 && remainingVerticalPhotos.length < 2) {
      // no more slides are possible with this group
      return null;
    } else if (remainingVerticalPhotos.length < 2 && remainingHorizontalPhotos.length >= 1) {
      return this.takeMaxValueHorizontalSlide(previousSlide, remainingHorizontalPhotos, searchGroup);
    } else if (remainingVerticalPhotos.length >= 2 && remainingHorizontalPhotos.length < 1) {
      return this.takeIntersectionVerticalSlide(previousSlide, remainingVerticalPhotos, searchGroup);
    } else if (Math.random() > 0.5) {
      return this.takeMaxValueHorizontalSlide(previousSlide, remainingHorizontalPhotos, searchGroup);
    } else {
      return this.takeIntersectionVerticalSlide(previousSlide, remainingVerticalPhotos, searchGroup);
    }
  }

  takeMaxValueHorizontalSlide(
    previousSlide: Slide,
    remainingPhotos: SearchGroupPhoto<'H'>[],
    searchGroup: Photo<Orientation>[]
  ): Slide {
    if (previousSlide.photos.length === 1) {
      const photo = this.takeBiggestValuePhoto(previousSlide.photos[0].tags, remainingPhotos, searchGroup);
      return new Slide([photo]);
    } else {
      const photo = this.takeBiggestValuePhoto(
        union(previousSlide.photos[0].tags, previousSlide.photos[1].tags),
        remainingPhotos,
        searchGroup
      );
      return new Slide([photo]);
    }
  }

  takeBiggestValuePhoto<T extends Orientation>(
    tags: Set<string>,
    remainingPhotos: SearchGroupPhoto<T>[],
    searchGroup: Photo<Orientation>[]
  ): Photo<T> {
    let remainingPhotoValues = remainingPhotos.map(remainingPhoto =>
      Math.min(
        difference(tags, remainingPhoto.photo.tags).size,
        intersection(tags, remainingPhoto.photo.tags).size,
        difference(remainingPhoto.photo.tags, tags).size
      )
    );

    let maxValueValue = Number.NEGATIVE_INFINITY;
    let maxValueIndex = -1;
    for (let i = 0; i < remainingPhotoValues.length; i++) {
      if (remainingPhotoValues[i] > maxValueValue) {
        maxValueValue = remainingPhotoValues[i];
        maxValueIndex = i;
      }
    }

    let selectedPhoto = remainingPhotos[maxValueIndex];
    removeFromArray(remainingPhotos, maxValueIndex);
    removeFromArray(searchGroup, selectedPhoto.searchGroupIndex);

    return selectedPhoto.photo;
  }

  takeIntersectionVerticalSlide(
    previousSlide: Slide,
    remainingPhotos: SearchGroupPhoto<'V'>[],
    searchGroup: Photo<Orientation>[]
  ): Slide {
    if (previousSlide.photos.length === 1) {
      const firstPhoto = this.takeBiggestIntersectionPhoto(previousSlide.photos[0], remainingPhotos, searchGroup);
      const secondPhoto = this.takeSmallestIntersectionPhoto(firstPhoto, remainingPhotos, searchGroup);
      return new Slide([firstPhoto, secondPhoto]);
    } else {
      const firstPhoto = this.takeBiggestIntersectionPhoto(previousSlide.photos[1], remainingPhotos, searchGroup);
      const secondPhoto = this.takeSmallestIntersectionPhoto(firstPhoto, remainingPhotos, searchGroup);
      return new Slide([firstPhoto, secondPhoto]);
    }
  }

  takeSmallestIntersectionPhoto<T extends Orientation>(
    photo: Photo<Orientation>,
    remainingPhotos: SearchGroupPhoto<T>[],
    searchGroup: Photo<Orientation>[]
  ): Photo<T> {
    let remainingIntersectionSizes = remainingPhotos.map(
      remainingPhoto => intersection(photo.tags, remainingPhoto.photo.tags).size
    );

    let minIntersectionValue = Number.POSITIVE_INFINITY;
    let minIntersectionIndex = -1;
    for (let i = 0; i < remainingIntersectionSizes.length; i++) {
      if (remainingIntersectionSizes[i] < minIntersectionValue) {
        minIntersectionValue = remainingIntersectionSizes[i];
        minIntersectionIndex = i;
      }
    }

    let selectedPhoto = remainingPhotos[minIntersectionIndex];
    removeFromArray(remainingPhotos, minIntersectionIndex);
    removeFromArray(searchGroup, selectedPhoto.searchGroupIndex);

    return selectedPhoto.photo;
  }

  takeBiggestIntersectionPhoto<T extends Orientation>(
    photo: Photo<Orientation>,
    remainingPhotos: SearchGroupPhoto<T>[],
    searchGroup: Photo<Orientation>[]
  ): Photo<T> {
    let remainingIntersectionSizes = remainingPhotos.map(
      remainingPhoto => intersection(photo.tags, remainingPhoto.photo.tags).size
    );

    let maxIntersectionValue = Number.NEGATIVE_INFINITY;
    let maxIntersectionIndex = -1;
    for (let i = 0; i < remainingIntersectionSizes.length; i++) {
      if (remainingIntersectionSizes[i] > maxIntersectionValue) {
        maxIntersectionValue = remainingIntersectionSizes[i];
        maxIntersectionIndex = i;
      }
    }

    let selectedPhoto = remainingPhotos[maxIntersectionIndex];
    removeFromArray(remainingPhotos, maxIntersectionIndex);
    removeFromArray(searchGroup, selectedPhoto.searchGroupIndex);

    return selectedPhoto.photo;
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
