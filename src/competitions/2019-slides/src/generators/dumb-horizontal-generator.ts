import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { SlideShowState } from '../models/slideShowState';
import { SlideShowSolution } from '../models/slideShowSolution';
import { Photo, Orientation } from '../models/photo';
import { Slide } from '../models/slide';
import { randomInArray, randIntMax } from '../../../../hashcode-tooling/utils/random-utils';
import { intersection } from '../../../../hashcode-tooling/utils/set-util';
import { removeFromArray } from '../../../../hashcode-tooling/utils/array-util';

export class DumbHorizontalGenerator implements ISolutionGenerator<SlideShowState, SlideShowSolution> {
  static NAME = 'DumbHorizontal';
  hasNextGenerator: boolean = true;

  get name(): string {
    return DumbHorizontalGenerator.NAME;
  }

  next(preConditions: SlideShowState): SlideShowSolution {
    // This is one shot
    this.hasNextGenerator = false;

    const solution = new SlideShowSolution(preConditions);
    let remainingHorizontalPhotos = [...preConditions.horizontalPhotos];
    let remainingVerticalPhotos = [...preConditions.verticalPhotos];

    let nextSlide = this.generateNextSlide(remainingHorizontalPhotos);
    while (nextSlide !== null) {
      solution.addSlide(nextSlide);
      nextSlide = this.generateNextSlide(remainingHorizontalPhotos);
    }

    return solution;
  }

  generateNextSlide(remainingHorizontalPhotos: Photo<'H'>[]): Slide | null {
    if (remainingHorizontalPhotos.length === 0) {
      return null;
    }

    let randomIndex = randIntMax(remainingHorizontalPhotos.length - 1);

    // Take a random horizontal photo
    const slide = new Slide([remainingHorizontalPhotos[randomIndex]]);
    removeFromArray(remainingHorizontalPhotos, randomIndex);
    return slide;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
