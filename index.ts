import { expose } from 'comlink';
import { geneticAlgorithm } from './geneticAlgorithm';

const exports = {
  geneticAlgorithm,
};

export type MyFirstWorker = typeof exports;

expose(exports);
