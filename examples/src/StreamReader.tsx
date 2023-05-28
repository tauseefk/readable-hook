import { FC } from 'react';
import { useReadable } from '../../src/useReadable';

export const StreamReader: FC<{ readableStream: ReadableStream<string> }> = ({
  readableStream,
}) => {
  const [{ value }, synchronize] = useReadable(async () => readableStream, 100);

  const line = value.split('\n').map((line, idx) => <p key={idx}>{line}</p>);

  return (
    <div className="flex flex-col gap scrollbar-trigger border-thick">
      <div className="flex card stream-output justify-around">
        {!value ? (
          <button className="m-auto-0" onClick={() => synchronize()}>
            Synchronize
          </button>
        ) : (
          <div id="scroller">
            {line}
            <div id="anchor"></div>
          </div>
        )}
      </div>
    </div>
  );
};
