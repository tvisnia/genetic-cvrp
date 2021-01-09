import { CAPACITY, cities } from './Const';
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
  const valid = !solution.some((path) => !!!analysePath(path).isValid);
  console.log(`miast : ${citiesIds.length}, każde auto maks. 1000 : ${valid}`);
};

export const getRandomInt = (min: number, maxExclusive: number) => {
  min = Math.ceil(min);
  maxExclusive = Math.floor(maxExclusive);
  return Math.floor(Math.random() * (maxExclusive - min)) + min;
};

export const getCitiesDistance = (city1: City, city2: City): number => {
  const toRad = (x: number) => {
    return (x * Math.PI) / 180;
  };
  const longitude1 = city1.longitude;
  const latitude1 = city1.latitude;
  const longitude2 = city2.longitude;
  const latitude2 = city2.latitude;

  const averageRadius = 6371;

  var x1 = latitude2 - latitude1;
  var dLat = toRad(x1);
  var x2 = longitude2 - longitude1;
  var dLon = toRad(x2);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(latitude1)) *
      Math.cos(toRad(latitude2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = averageRadius * c;
  return distance;
};

export const getPathDistance = (path: Path): number => {
  let total: number = 0;
  const fromDepot = getCitiesDistance(cities[0], path[0]);
  const toDepot = getCitiesDistance(cities[0], path[path.length - 1]);

  path.forEach((city, index) => {
    if (index !== path.length - 1)
      total += getCitiesDistance(city, path[index + 1]);
  });
  return total + fromDepot + toDepot;
};

export const copyPath = (path: Path): Path => path.slice();

export const copySolution = (sol: Solution): Solution =>
  sol.slice().map((path) => copyPath(path));

export const copyPopulation = (pop: Population): Population =>
  pop.slice().map((sol) => copySolution(sol));

export const getSolutionQuality = (solution: Solution): number =>
  solution.reduce((acc, path) => (acc += getPathDistance(path)), 0);

export const CompareSolutionsByDistanceAscending = (
  prevSolution: Solution,
  nextSolution: Solution
) => getSolutionQuality(prevSolution) - getSolutionQuality(nextSolution);

export const getRandomSolutions = (population: Population): Population => {
  //tworzenie populacji tymczasowej - reprodukcja obcinająca
  const temporaryPopulation = population.slice(
    0,
    Math.round(population.length / 2)
  );
  const lastIndex = temporaryPopulation.length - 1;
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
