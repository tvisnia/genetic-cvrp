import { CAPACITY } from './Const';
import { City, Population, Solution } from './../model/model';
import { getRandomInt, analysePath } from './helpers';

export const generateRandomPopulation = (
  count: number,
  cities: City[]
): Population => [...Array(count)].map(() => generateRandomSolution(cities));

export const generateRandomSolution = (cities: City[]): Solution => {
  const solution: Solution = [[], [], [], [], []];
  const citiesCopy = cities.slice();

  solution.forEach((path) => {
    const randomCityId = getRandomInt(1, citiesCopy.length);
    path.push(citiesCopy[randomCityId]);
    citiesCopy.splice(randomCityId, 1);
  });

  while (citiesCopy.length > 1) {
    const randomCityIndex = getRandomInt(1, citiesCopy.length);
    const randomCityDemand = citiesCopy[randomCityIndex].demand;
    const freeCarIndex = solution.findIndex(
      (path) => analysePath(path).cost + randomCityDemand <= CAPACITY
    );
    if (~freeCarIndex) {
      solution[freeCarIndex].push(citiesCopy[randomCityIndex]);
      citiesCopy.splice(randomCityIndex, 1);
    }
  }
  return solution;
};
