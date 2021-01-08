import { CAPACITY, DEGREE_TO_KILOMETERS_FACTOR, cities } from './Const';
import { Path, PathInfo, Solution, Population, City } from './../model/model';

export const isValidPath = (path: Path): boolean =>
  path
    .map((city) => city.demand)
    .reduce((previous, current) => previous + current) <= CAPACITY;

export const analysePath = (path: Path): PathInfo => {
  const cost = path
    .map((city) => city.demand)
    .reduce((previous, current) => previous + current);
  const isValid = cost <= CAPACITY;
  return {
    cost,
    isValid,
  };
};

export const analyseSolution = (solution: Solution) => {
  const citiesIds: number[] = [];
  solution.forEach((path) => path.forEach((city) => citiesIds.push(city.id)));
  solution.forEach((path) => console.log(analysePath(path).isValid));
  citiesIds.sort();
  console.log(citiesIds);
  console.log(`equal : ${new Set(citiesIds).size === citiesIds.length}`);
};

export const getRandomInt = (min: number, maxExclusive: number) => {
  min = Math.ceil(min);
  maxExclusive = Math.floor(maxExclusive);
  return Math.floor(Math.random() * (maxExclusive - min)) + min;
};

export const getCitiesDistance = (city1: City, city2: City): number =>
  Math.round(
    Math.sqrt(
      Math.pow(city1.longitude - city2.longitude, 2) +
        Math.pow(city1.latitude - city2.latitude, 2)
    ) * DEGREE_TO_KILOMETERS_FACTOR
  );

export const getPathDistance = (path: Path): number =>
  path.reduce((total, currentCity, currentIndex) => {
    let previousCity: City;
    let nextCity: City;
    if (currentIndex === 0) {
      previousCity = cities[0]; //kraków
      nextCity = currentCity;
    } else {
      nextCity = currentCity;
      previousCity = path[currentIndex - 1];
    }
    return !!nextCity && !!previousCity
      ? total + getCitiesDistance(previousCity, nextCity)
      : total;
  }, 0);

export const copyCity = (city: City): City => Object.assign({} as City, city);
export const copyPath = (path: Path): Path =>
  path.slice().map((city) => copyCity(city));
export const copySolution = (sol: Solution): Solution =>
  sol.slice().map((path) => copyPath(path));
export const copyPopulation = (pop: Population): Population =>
  pop.slice().map((sol) => copySolution(sol));

export const getSolutionQuality = (solution: Solution): number =>
  solution.reduce((acc, path) => (acc += getPathDistance(path)), 0);

// export const CompareSolutionsByDistanceAscending = (
//   prevSolution: Solution,
//   nextSolution: Solution
// ) => getSolutionQuality(prevSolution) - getSolutionQuality(nextSolution);

export const printSolution = (sol: Solution) => {
  console.log(`___________________________`);
  sol.forEach((path, i) => {
    console.log(
      `Path nr ${i}: ${path.map((c) => c.id)}, cost: ${analysePath(path).cost}`
    );
  });
};

export const getRandomSolutions = (population: Population): Population => {
  const lastIndex = population.length - 1;
  const freeSolutionIndexes = [...Array(lastIndex + 1)].map(
    (_, index) => index
  );
  const randomSolution1Index =
    freeSolutionIndexes[getRandomInt(0, lastIndex + 1)];
  freeSolutionIndexes.splice(randomSolution1Index, 1);
  const randomSolution2Index = freeSolutionIndexes[getRandomInt(0, lastIndex)];
  freeSolutionIndexes.splice(randomSolution2Index, 1);

  const randomSolution1: Solution = [...population[randomSolution1Index]];
  const randomSolution2: Solution = [...population[randomSolution2Index]];
  return [randomSolution1, randomSolution2];
};

export const hasPathCity = (path: Path, city: City) =>
  !!~path.findIndex((c) => c.id === city.id);
