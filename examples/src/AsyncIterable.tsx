import { Fragment } from 'react';
import { useIterable } from '../../src';
import { GRID_HEIGHT } from './constants';
import { getCharactersForever } from './utils';

export const AsyncIterableReader = () => {
  const [{ value }, synchronize] = useIterable<string>(
    async (_, signal) => getCharactersForever(signal),
    {
      accumulate: true,
      accumulator: (acc, curr) =>
        acc
          ? acc
              .split('\n')
              .slice(-1 * GRID_HEIGHT)
              .join('\n')
              .concat(curr)
              .concat('\n')
          : curr.concat('\n'),
      delay: 100,
    },
  );

  const lines = value?.split('\n') || [];
  const renderableLines = lines.map((line, lineIdx) => {
    const elements = line.split(',').map((num, charIdx) => {
      return (
        <span
          className={`dot color-${Number.parseInt(num, 10) + 1}`}
          // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
          key={`${lineIdx}_${charIdx}`}
        />
      );
    });
    // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
    return <Fragment key={lineIdx}>{elements}</Fragment>;
  });

  return (
    <div className="flex flex-col gap border w-full relative">
      <div className="flex card stream-output justify-around relative">
        {!value ? (
          <button
            type="button"
            className="m-auto-0 ghost-rect"
            onClick={() => {
              const abortController = new AbortController();
              synchronize({ signal: abortController.signal });
              setTimeout(() => {
                abortController.abort();
              }, 2000);
            }}
          >
            Synchronize
          </button>
        ) : (
          <div className="grid grid-cols-18 rows-[16px]">{renderableLines}</div>
        )}
      </div>
    </div>
  );
};
