/* eslint-disable @typescript-eslint/no-unused-vars */
const DEFAULT_COLORS = ['#DA5E46', '#FA9478', '#FEDEB8', '#4373B6', '#184382'];

const ALT_COLORS = ['#A9FBD7', '#B2FFD6', '#B4D6D3', '#B8BAC8', '#AA78A6'];

const MONO_COLORS = ['#B1B1B1', '#E0E0E0', '#999999', '#606060', '#404040'];

const getRandomColor = () => {
  return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
};
const BLOCK_CLOLORS = Array(500)
  .fill(null)
  .map(() => getRandomColor());

export const getBlockColor = (idx: number) => {
  return BLOCK_CLOLORS[idx % BLOCK_CLOLORS.length];
};

export const LINES_TO_RENDER = 17;
