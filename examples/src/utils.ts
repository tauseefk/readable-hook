import { DEFAULT_COLORS, GRID_HEIGHT, GRID_WIDTH } from './constants';

const flipCoin = () => Math.random() < 0.5;
const flipResult = flipCoin();

const getRandomUInt = () => {
  return Math.floor(Math.random() * DEFAULT_COLORS.length);
};

export const BLOCK_NUMBERS = Array(GRID_WIDTH * GRID_HEIGHT)
  .fill(null)
  .map((_, idx) =>
    flipResult ? idx % DEFAULT_COLORS.length : getRandomUInt(),
  );

export const getCharacters = (idx: number) => {
  const idxAdj = idx * GRID_WIDTH;
  const idxStart = idxAdj % BLOCK_NUMBERS.length;
  const idxEnd = (idxAdj + GRID_WIDTH) % BLOCK_NUMBERS.length;

  return idxEnd < idxStart
    ? [...BLOCK_NUMBERS.slice(idxStart), ...BLOCK_NUMBERS.slice(0, idxEnd)]
    : BLOCK_NUMBERS.slice(idxStart, idxEnd);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function* getCharactersForever(signal?: AbortSignal) {
  let idx = 0;

  while (true) {
    if (signal?.aborted) {
      break;
    }
    await delay(100);
    idx += 1;
    yield getCharacters(idx).toString();
  }
}
