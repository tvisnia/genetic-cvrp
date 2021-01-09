import { generateRandomPopulation } from './../commons/solutionGenerator';
import { SET_PROBABILITY_0_20, cities } from './../commons/Const';
import {
  City,
  Path,
  Solution,
  Population,
  AlgorithmResult,
} from './../model/model';
import {
  CompareSolutionsByDistanceAscending,
  getSolutionQuality,
  getRandomSolutions as getSolutionsForCrossover,
  getRandomInt,
  hasPathCity,
  copyPopulation,
} from './../commons/helpers';

export const geneticAlgorithm = (
  basePopulationCount: number,
  generations: number
): AlgorithmResult => {
  const basePopulation: Population = generateRandomPopulation(
    basePopulationCount,
    cities
  );
  basePopulation.sort(CompareSolutionsByDistanceAscending);

  let basePopulationCopy: Population = copyPopulation(basePopulation);

  let bestStartQuality = getSolutionQuality(basePopulation[0]);
  let crossovers = 0;
  let mutations = 0;

  [...Array(generations)].forEach((_, generationIndex) => {
    //przygotowanie do krzyżowania -losowanie dwóch osobników/rozwiązań z populacji tymczasowej
    const [randomSolution1, randomSolution2] = getSolutionsForCrossover(
      basePopulationCopy
    );
    const aCityPathIndexIn1 = 0;
    const aCityIndexInPath1 = 0;
    const cityA: City = randomSolution1[aCityPathIndexIn1][aCityIndexInPath1];
    const indexCityB = cities.findIndex(
      (city) => city.demand === cityA.demand && city.id !== cityA.id
    );

    if (~indexCityB) {
      // 1 warunek krzyżowania spełniony - znaleziono miasto o tym samym zapotrzebowaniu na towar
      const cityB = cities[indexCityB];

      const bCityPathIndexIn1 = randomSolution1.findIndex((path: Path) =>
        hasPathCity(path, cityB)
      );
      const bCityPathIndexIn2 = randomSolution2.findIndex((path: Path) =>
        hasPathCity(path, cityB)
      );
      const aCityPathIndexIn2 = randomSolution2.findIndex((path: Path) =>
        hasPathCity(path, cityA)
      );

      // zamiana w pierwszym rozwiązaniu
      const bCityIndexInPath1 = randomSolution1[bCityPathIndexIn1].findIndex(
        (city: City) => city.id === cityB.id
      );

      randomSolution1[aCityPathIndexIn1][aCityIndexInPath1] = cityB; // zamiana A -> B
      randomSolution1[bCityPathIndexIn1][bCityIndexInPath1] = cityA; //zamiana B -> A

      //zamiana w drugim rozwiązaniu
      const bCityIndexInPath2 = randomSolution2[bCityPathIndexIn2].findIndex(
        (city: City) => city.id === cityB.id
      );
      const aCityIndexInPath2 = randomSolution2[aCityPathIndexIn2].findIndex(
        (city: City) => city.id === cityA.id
      );

      randomSolution2[aCityPathIndexIn2][aCityIndexInPath2] = cityB; // zamiana A -> B
      randomSolution2[bCityPathIndexIn2][bCityIndexInPath2] = cityA; // zamiana B -> A

      const solution1Quality = getSolutionQuality(randomSolution1);
      const solution2Quality = getSolutionQuality(randomSolution2);
      const currentBestQuality = basePopulation.map((s: Solution) =>
        getSolutionQuality(s)
      )[0];

      const newBestSolution =
        solution1Quality === solution2Quality
          ? randomSolution2
          : solution1Quality < solution2Quality
          ? randomSolution1
          : randomSolution2;
      const newBestQuality = getSolutionQuality(newBestSolution);
      if (newBestQuality < currentBestQuality) {
        basePopulation.splice(basePopulation.length - 1, 1);
        basePopulation.push(newBestSolution);
        basePopulation.sort(CompareSolutionsByDistanceAscending);
        crossovers++;
      }
      basePopulationCopy = copyPopulation(basePopulation);
    }

    //mutacja
    const mutateRandomIndex = getRandomInt(0, SET_PROBABILITY_0_20.length);
    const mutateOn: boolean = SET_PROBABILITY_0_20[mutateRandomIndex] % 2 === 0;

    if (mutateOn) {
      const randomSolutionIndex = getRandomInt(0, basePopulationCopy.length);
      const randomSolution = basePopulationCopy[randomSolutionIndex];
      const randomSolutionInitialQuality = getSolutionQuality(randomSolution);
      const randomPathIndex = getRandomInt(0, randomSolution.length);
      const randomPath = randomSolution[randomPathIndex];
      //jeśli ścieżka zawiera tylko jedno miasto
      if (randomPath.length !== 1) {
        const randomCityIndex1 = getRandomInt(0, randomPath.length);
        const randomCityIndex2 = Math.abs(randomCityIndex1 - 1);
        const cityA = randomPath[randomCityIndex1];
        const cityB = randomPath[randomCityIndex2];
        randomPath[randomCityIndex1] = cityB;
        randomPath[randomCityIndex2] = cityA;
        const randomSolutionPostMutationQuality = getSolutionQuality(
          randomSolution
        );
        if (randomSolutionInitialQuality > randomSolutionPostMutationQuality) {
          mutations++;
          if (randomSolutionIndex === 0)
            basePopulation[randomSolutionIndex] = randomSolution;
        }
        basePopulationCopy = copyPopulation(basePopulation);
        basePopulation.sort(CompareSolutionsByDistanceAscending);
      }
    }
  }); //zakres pętli - koniec algorytmu

  const bestEndSolution = basePopulation[0];
  const bestEndQuality = getSolutionQuality(bestEndSolution);
  return {
    bestStartQuality,
    bestEndQuality,
    crossovers,
    mutations,
    bestEndSolution,
  };
};
