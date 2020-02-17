import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from '../models/slideShowSolution';
import { Photo, Orientation } from '../models/photo';
import { Slide } from '../models/slide';
import { randIntMax } from '../../../../hashcode-tooling/utils/random-utils';
import { removeFromArray } from '../../../../hashcode-tooling/utils/array-util';

export class RandomGenerator implements ISolutionGenerator<SlideShowState, SlideShowSolution> {
  static NAME = 'RandomGenerator';
  hasNextGenerator: boolean = true;
  remainingVerticalPhotos: Photo<'V'>[] = [];
  remainingHorizontalPhotos: Photo<'H'>[] = [];

  get name(): string {
    return RandomGenerator.NAME;
  }

  next(preConditions: SlideShowState): SlideShowSolution {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new SlideShowSolution(preConditions);
    this.remainingVerticalPhotos = [...preConditions.verticalPhotos];
    this.remainingHorizontalPhotos = [...preConditions.horizontalPhotos];

    // Ends if there are not 2 vertical or 1 horizontal left
    while (this.remainingVerticalPhotos.length >= 2 || this.remainingHorizontalPhotos.length >= 1) {
      let nextSlide = this.generateNextSlide();
      solution.addSlide(nextSlide);
    }

    return solution;
  }

  generateNextSlide(): Slide {
    // Pick randomly vertical or horizontal, except if there is only vertical or horizontal left
    if (this.remainingVerticalPhotos.length < 2 && this.remainingHorizontalPhotos.length >= 1) {
      return this.takeHorizontalSlide();
    } else if (this.remainingVerticalPhotos.length >= 2 && this.remainingHorizontalPhotos.length < 1) {
      return this.takeVerticalSlide();
    } else if (Math.random() > 0.5) {
      return this.takeHorizontalSlide();
    } else {
      return this.takeVerticalSlide();
    }
  }

  takeVerticalSlide(): Slide {
    let firstPhoto = this.takeRandomVerticalPhoto();
    let secondPhoto = this.takeRandomVerticalPhoto();
    return new Slide([firstPhoto, secondPhoto]);
  }

  takeHorizontalSlide(): Slide {
    let selectedPhoto = this.takeRandomHorizontalPhoto();
    return new Slide([selectedPhoto]);
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

    try {
      removeFromArray(this.remainingHorizontalPhotos, randomIndex);
    } catch {
      console.log(`Random index ${randomIndex}`);
    }

    return selectedPhoto;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
