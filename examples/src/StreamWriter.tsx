import { FC, memo, useRef, useState } from 'react';
import { GRID_WIDTH } from './constants';

const getCharacter = (idx: number) => {
  if (idx % (GRID_WIDTH + 1) === 0) {
    return '\n';
  }

  return '0';
};

interface StreamWriterProps {
  writableStream: WritableStream;
}
export const StreamWriter: FC<StreamWriterProps> = ({ writableStream }) => {
  const data = useRef(0);
  const [rafId, setRafId] = useState<number>();

  function appendAndScheduleNext() {
    const writer = writableStream.getWriter();
    writer.write(getCharacter(data.current));
    data.current = data.current + 1;
    writer.releaseLock();

    setRafId(
      requestAnimationFrame(() => {
        appendAndScheduleNext();
      }),
    );
  }

  function handleStopTimer() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      setRafId(undefined);
    }
  }

  return (
    <div className="flex flex-row gap justify-around">
      {!rafId ? (
        <button className="ghost-rect" onClick={appendAndScheduleNext}>
          Start Streaming
        </button>
      ) : (
        <button className="ghost-rect" onClick={handleStopTimer}>
          Stop Streaming
        </button>
      )}
    </div>
  );
};

export const MemoStreamWriter = memo(StreamWriter);
