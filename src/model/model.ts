export interface City {
  longitude: number;
  latitude: number;
  id: number;
  demand: number;
  name: string;
}

export interface Car {
  capacity: number;
}

export interface PathInfo {
  cost: number;
  isValid: boolean;
}

export type Path = City[];

export type Solution = Path[];

export type Population = Solution[];
