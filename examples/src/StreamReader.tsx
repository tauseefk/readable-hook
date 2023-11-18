import { FC } from 'react';
import { useReadable } from '../../src/useReadable';
import { GRID_HEIGHT, getBlockColor } from './constants';

export const StreamReader: FC<{ readableStream: ReadableStream<string> }> = ({
  readableStream,
}) => {
  const [{ value }, synchronize] = useReadable(async () => readableStream, {
    accumulate: true,
    delay: 100,
  });

  const lines = value.split('\n');
  const tailLineIdx = Math.max(0, lines.length - GRID_HEIGHT);
  const renderableLines = lines.slice(tailLineIdx).map((line, lineIdx) => {
    const elements = line.split('').map((_, charIdx) => {
      return (
        <span
          style={{
            backgroundColor: getBlockColor(
              (tailLineIdx + lineIdx) * line.length + charIdx,
            ),
          }}
          key={`${lineIdx}_${charIdx}`}
          className="dot"
        ></span>
      );
    });
    return (
      <div className="flex flex-row" key={lineIdx}>
        {elements}
      </div>
    );
  });

  return (
    <div className="flex flex-col gap border w-full relative">
      <div className="flex card stream-output justify-around relative">
        {!value ? (
          <button className="m-auto-0 ghost-rect" onClick={() => synchronize()}>
            Synchronize
          </button>
        ) : (
          <div className="gap flex flex-col">{renderableLines}</div>
        )}
      </div>
    </div>
  );
};
