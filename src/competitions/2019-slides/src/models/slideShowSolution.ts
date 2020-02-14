import { ISolution } from '../../../../hashcode-tooling/i-solution';
import { SlideShowState } from './slideShowState';
import { Slide } from './slide';
import { OutputString } from '../../../../hashcode-tooling/output-string';
import { difference, intersection } from '../../../../hashcode-tooling/utils/set-util';

export class SlideShowSolution implements ISolution<SlideShowState> {
  private _score: number = 0;

  public slides: Slide[] = [];

  constructor(public state: SlideShowState) {}

  get score() {
    // Note the score is calculated once, not at each call
    return this._score;
  }

  set score(newScore: number) {
    this._score = newScore;
  }

  addSlide(slide: Slide): void {
    const slideLength = this.slides.length;

    this.slides.push(slide);
    if (slideLength > 0) {
      this.score += this.getSlideTransitionValue(this.slides[slideLength - 1], slide);
    }
  }

  getSlideTransitionValue(firstSlide: Slide, secondSlide: Slide): number {
    const firstSlideUniqueTags = difference(firstSlide.getSlideTags(), secondSlide.getSlideTags()).size;
    const slidesIntersectionsTags = intersection(firstSlide.getSlideTags(), secondSlide.getSlideTags()).size;
    const secondSlideUniqueTags = difference(secondSlide.getSlideTags(), firstSlide.getSlideTags()).size;

    return Math.min(firstSlideUniqueTags, slidesIntersectionsTags, secondSlideUniqueTags);
  }

  isValid = () => true;

  toOutputString(): string {
    const output = new OutputString();
    output.addValue(this.slides.length);

    this.slides.forEach(slide => {
      output.nextLine();

      slide.photos.forEach(photo => output.addValue(photo.index));
    });

    return output.string;
  }

  toDumpString(): string {
    return JSON.stringify(this, null, 2);
  }

  populateFromDumpString(dumpString: string): void {
    throw 'Not working'; // TODO would need to do some complex things for Set() property
  }
}
