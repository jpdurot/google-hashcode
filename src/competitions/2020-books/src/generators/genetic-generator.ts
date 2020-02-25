import { ISolutionGenerator } from '../../../../hashcode-tooling/i-solution-generator';
import { PreConditions } from '../models/preConditions';
import { Solution } from '../models/solution';
import { SignedUpLibrary } from '../models/signedUpLibrary';
import { randIntMax } from '../../../../hashcode-tooling/utils/random-utils';
import { removeFromArray } from '../../../../hashcode-tooling/utils/array-util';

export class GeneticGenerator implements ISolutionGenerator<PreConditions, Solution> {
  static NAME = 'Genetic';
  hasNextGenerator: boolean = true;
  iterations = 0;
  currentPopulation: Solution[] = [];
  populationSize = 30;
  preservationRate = 0.7;
  mutationRate = 0.3;
  numberOfIterations = 2000;

  preConditions?: PreConditions;

  get name(): string {
    return GeneticGenerator.NAME;
  }

  next(preConditions: PreConditions): Solution {
    this.preConditions = preConditions;
    this.iterations++;

    if (this.iterations >= this.numberOfIterations) {
      this.hasNextGenerator = false;
    }

    if (this.currentPopulation.length === 0) {
      // generate first population randomly
      for (let i = 0; i < this.populationSize; i++) {
        this.currentPopulation.push(this.generateRandomSolution());
      }

      return this.getMaximumScoreSolution(this.currentPopulation);
    } else {
      this.currentPopulation = this.generateNextPopulation();
      let maxScoreSolution = this.getMaximumScoreSolution(this.currentPopulation);
      console.log(`Current iteration: ${this.iterations}, Current maxsolution score: ${maxScoreSolution.score}`);
      return maxScoreSolution;
    }
  }

  generateNextPopulation(): Solution[] {
    let nextPopulation: Solution[] = [];
    this.currentPopulation.sort((a, b) => b.score - a.score);

    let breeders: Solution[] = [];

    for (let i = 0; i < this.populationSize * this.preservationRate; i++) {
      nextPopulation.push(this.currentPopulation[i]);
      breeders.push(this.currentPopulation[i]);
    }

    for (let i = nextPopulation.length - 1; i < this.populationSize; i++) {
      let firstIndex = 0;
      let secondIndex = 0;
      while (firstIndex === secondIndex) {
        firstIndex = randIntMax(breeders.length - 1);
        secondIndex = randIntMax(breeders.length - 1);
      }
      nextPopulation.push(this.breed(breeders[firstIndex], breeders[secondIndex]));
    }

    for (let i = 0; i < this.populationSize * this.mutationRate; i++) {
      let mutatedIndex = randIntMax(nextPopulation.length);
      nextPopulation[mutatedIndex] = this.mutate(nextPopulation[mutatedIndex]);
    }

    return nextPopulation;
  }

  mutate(solutionToMutate: Solution): Solution {
    this.resetPreConditions();
    let preConditions = this.preConditions as PreConditions;
    let mutatedSolution = new Solution(preConditions);
    let originalLibraries = [...preConditions.libraries];
    let possibleLibraries = [...preConditions.libraries];
    let solutionLibraries = [...solutionToMutate.signedUpLibraries];
    while (solutionLibraries.length > 0 || possibleLibraries.length > 0) {
      if (solutionLibraries.length <= 0) {
        let randIndex = randIntMax(possibleLibraries.length - 1);
        let library = possibleLibraries[randIndex];
        let originalLibrary = originalLibraries[library.id];
        removeFromArray(possibleLibraries, randIndex);
        if (mutatedSolution.canAddLibrary(library.signupDays) && !originalLibrary.taken) {
          originalLibrary.taken = true;
          mutatedSolution.addSignedUpLibrary(new SignedUpLibrary(library.bookIds, library.id));
        }
      } else if (possibleLibraries.length <= 0) {
        let randIndex = randIntMax(solutionLibraries.length - 1);
        let library = solutionLibraries[randIndex];
        let originalLibrary = originalLibraries[library.libraryId];
        removeFromArray(solutionLibraries, randIndex);
        if (mutatedSolution.canAddLibrary(originalLibrary.signupDays) && !originalLibrary.taken) {
          originalLibrary.taken = true;
          mutatedSolution.addSignedUpLibrary(library);
        }
      } else if (Math.random() > 1 - this.mutationRate) {
        let randIndex = randIntMax(possibleLibraries.length - 1);
        let library = possibleLibraries[randIndex];
        let originalLibrary = originalLibraries[library.id];
        removeFromArray(possibleLibraries, randIndex);
        if (mutatedSolution.canAddLibrary(library.signupDays) && !originalLibrary.taken) {
          originalLibrary.taken = true;
          mutatedSolution.addSignedUpLibrary(new SignedUpLibrary(library.bookIds, library.id));
        }
      } else {
        let randIndex = randIntMax(solutionLibraries.length - 1);
        let library = solutionLibraries[randIndex];
        let originalLibrary = originalLibraries[library.libraryId];
        removeFromArray(solutionLibraries, randIndex);
        if (mutatedSolution.canAddLibrary(originalLibrary.signupDays) && !originalLibrary.taken) {
          originalLibrary.taken = true;
          mutatedSolution.addSignedUpLibrary(library);
        }
      }
    }

    return mutatedSolution;
  }

  breed(firstBreeder: Solution, secondBreeder: Solution): Solution {
    this.resetPreConditions();
    let preConditions = this.preConditions as PreConditions;
    let childSolution = new Solution(preConditions);
    let originalLibraries = [...preConditions.libraries];

    let currentFirstBreederIndex = 0;
    let currentSecondBreederIndex = 0;
    for (let i = 0; i < firstBreeder.signedUpLibraries.length + secondBreeder.signedUpLibraries.length; i++) {
      if (i % 2 === 0 && currentFirstBreederIndex < firstBreeder.signedUpLibraries.length) {
        let selectedLibrary = firstBreeder.signedUpLibraries[currentFirstBreederIndex];
        let originalLibrary = originalLibraries[selectedLibrary.libraryId];
        if (childSolution.canAddLibrary(originalLibrary.signupDays) && !originalLibrary.taken) {
          originalLibrary.taken = true;
          childSolution.addSignedUpLibrary(selectedLibrary);
        }
        currentFirstBreederIndex++;
      } else if (currentSecondBreederIndex < secondBreeder.signedUpLibraries.length) {
        let selectedLibrary = secondBreeder.signedUpLibraries[currentSecondBreederIndex];
        let originalLibrary = originalLibraries[selectedLibrary.libraryId];
        if (childSolution.canAddLibrary(originalLibrary.signupDays) && !originalLibrary.taken) {
          originalLibrary.taken = true;
          childSolution.addSignedUpLibrary(selectedLibrary);
        }
        currentSecondBreederIndex++;
      }
    }

    // fill up the remaining space with random libraries
    let possibleLibraries = [...originalLibraries.filter(l => !l.taken)];

    while (possibleLibraries.length > 0) {
      let randIndex = randIntMax(possibleLibraries.length - 1);
      let library = possibleLibraries[randIndex];
      removeFromArray(possibleLibraries, randIndex);
      if (childSolution.canAddLibrary(library.signupDays)) {
        childSolution.addSignedUpLibrary(new SignedUpLibrary(library.bookIds, library.id));
      }
    }

    return childSolution;
  }

  getMaximumScoreSolution(solutions: Solution[]): Solution {
    let maxScoreSolution = solutions[0];
    for (let i = 1; i < solutions.length; i++) {
      if (solutions[i].score > maxScoreSolution.score) {
        maxScoreSolution = solutions[i];
      }
    }
    return maxScoreSolution;
  }

  resetPreConditions(): void {
    this.preConditions?.libraries.forEach(library => {
      library.taken = false;
    });
    this.preConditions?.books.forEach(book => {
      book.isAvailable = true;
    });
  }

  generateRandomSolution(): Solution {
    this.resetPreConditions();

    let possibleLibraries = [...this.preConditions?.libraries];
    let solution = new Solution(this.preConditions as PreConditions);
    while (possibleLibraries.length > 0) {
      let randIndex = randIntMax(possibleLibraries.length - 1);
      let library = possibleLibraries[randIndex];
      removeFromArray(possibleLibraries, randIndex);
      if (solution.canAddLibrary(library.signupDays)) {
        solution.addSignedUpLibrary(new SignedUpLibrary(library.bookIds, library.id));
      }
    }

    return solution;
  }

  hasNext(): boolean {
    return this.hasNextGenerator;
  }
}
