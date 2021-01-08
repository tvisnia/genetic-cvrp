import { generateRandomPopulation } from './../commons/solutionGenerator';
import { SET_PROBABILITY_0_20, cities } from './../commons/Const';
import { Solution, City, Path, Population } from './../model/model';
import {
  getSolutionQuality,
  copyPopulation,
  getRandomInt,
  hasPathCity,
  getRandomSolutions,
} from './../commons/helpers';

// const CompareSolutionsByDistanceAscending = (
//   prevSolution: Solution,
//   nextSolution: Solution
// ) => getSolutionQuality(prevSolution) - getSolutionQuality(nextSolution);

export const geneticAlgorithm = (
  basePopulationCount: number,
  generations: number
) => {
  const basePopulation: Population = generateRandomPopulation(
    basePopulationCount,
    cities
  );
  basePopulation.sort(
    (prevSolution, nextSolution) =>
      getSolutionQuality(prevSolution) - getSolutionQuality(nextSolution)
  );

  let basePopulationCopy: Population = copyPopulation(basePopulation);

  let bestStartQuality = getSolutionQuality(basePopulation[0]);
  let crossovers = 0;
  let mutations = 0;

  console.log(
    `Start: ${basePopulation.map((s: Solution) => getSolutionQuality(s))}`
  );
  [...Array(generations)].forEach((_, generationIndex) => {
    if ((generationIndex + 1) % 10000 === 0)
      console.log(`Powstałych generacji: ${generationIndex + 1}`);
    // const bestSolution = basePopulationByQualityAsc[0]

    //przygotowanie do krzyżowania
    //losowanie dwóch osobników/rozwiązań
    const [randomSolution1, randomSolution2] = getRandomSolutions(
      basePopulationCopy
    );
    const aCityPathIndexIn1 = 0;
    const aCityIndexInPath1 = 0;
    const cityA: City = randomSolution1[aCityPathIndexIn1][aCityIndexInPath1];
    const indexCityB = cities.findIndex(
      (city) => city.demand === cityA.demand && city.id !== cityA.id
    );

    if (~indexCityB) {
      // 1 warunek krzyżowania spełniony
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
      // zamiana A -> B
      randomSolution1[aCityPathIndexIn1][aCityIndexInPath1] = cityB;
      //zamiana B -> A
      randomSolution1[bCityPathIndexIn1][bCityIndexInPath1] = cityA;

      //zamiana w drugim rozwiązaniu
      const bCityIndexInPath2 = randomSolution2[bCityPathIndexIn2].findIndex(
        (city: City) => city.id === cityB.id
      );
      const aCityIndexInPath2 = randomSolution2[aCityPathIndexIn2].findIndex(
        (city: City) => city.id === cityA.id
      );
      // zamiana A -> B
      randomSolution2[aCityPathIndexIn2][aCityIndexInPath2] = cityB;
      // zamiana B -> A
      randomSolution2[bCityPathIndexIn2][bCityIndexInPath2] = cityA;

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
        basePopulation.sort(
          (prevSolution, nextSolution) =>
            getSolutionQuality(prevSolution) - getSolutionQuality(nextSolution)
        );
        crossovers++;
        console.log(
          `najlepsza jakość dotychczas: ${
            basePopulation.map((s: Solution) => getSolutionQuality(s))[0]
          }`
        );
      }
      //ocena otrzymanych rozwiązań :
      basePopulationCopy = copyPopulation(basePopulation);
      // console.log(
      //     `populacja bazowa po krzyżowaniu i sorcie : ${basePopulation.map((s) =>
      //         getSolutionQuality(s)
      //     )}`
      // );
    } else {
      //   console.log(`corresponding city not found, next generation`);
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
        // console.log(
        //   `Mutation did occur and improved solution by ${
        //     randomSolutionInitialQuality - randomSolutionPostMutationQuality
        //   } kilometers.`
        // );
        if (randomSolutionIndex === 0) {
          // console.log(
          //   `mutacja najlepszego : ${basePopulation.map((s: Solution) =>
          //     getSolutionQuality(s)
          //   )}`
          // );
          basePopulation[randomSolutionIndex] = randomSolution;
        }
      }
      basePopulationCopy = copyPopulation(basePopulation);
      basePopulation.sort(
        (prevSolution, nextSolution) =>
          getSolutionQuality(prevSolution) - getSolutionQuality(nextSolution)
      );
    }
  }); //koniec petli iteracji/generacji

  // console.log(
  //   `Qualities after algorithm execution : ${basePopulation.map((s: Solution) =>
  //     getSolutionQuality(s)
  //   )}`
  // );
  const bestEndQuality = getSolutionQuality(basePopulation[0]);
  return {
    bestStartQuality,
    bestEndQuality,
    crossovers,
    mutations,
    solution: basePopulation[0],
  };
  //   analyseSolution(basePopulation[0]);
};
