import { create } from "random-seed";
import { createContext, useContext } from "react";

const RandomContext = createContext<any>({});

export const RandomProvider = RandomContext.Provider;
export function useRandom() {
  const randomSeed = useContext(RandomContext);
  return create(randomSeed);
}

export function useShuffled<T>(array: T[]): T[] {
  const rng = useRandom();

  const arrayCopy: T[] = JSON.parse(JSON.stringify(array));

  var currentIndex = arrayCopy.length,
    temporaryValue: T,
    randomIndex: number;

  while (0 !== currentIndex) {
    randomIndex = rng.intBetween(0, currentIndex);
    currentIndex -= 1;

    temporaryValue = arrayCopy[currentIndex];
    arrayCopy[currentIndex] = arrayCopy[randomIndex];
    arrayCopy[randomIndex] = temporaryValue;
  }

  return arrayCopy;
}
