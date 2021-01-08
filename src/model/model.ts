export interface City {
  longitude: number;
  latitude: number;
  id: number;
  demand: number;
  name: string;
}

export interface PathInfo {
  cost: number;
  isValid: boolean;
}

export interface AlgorithmResult {
  bestStartQuality: number;
  bestEndQuality: number;
  crossovers: number;
  mutations: number;
  bestEndSolution: Solution;
}

export type Path = City[];

export type Solution = Path[];

export type Population = Solution[];
