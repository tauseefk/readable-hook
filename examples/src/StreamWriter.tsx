import { FC, memo, useRef, useState } from 'react';
import { getCharacters } from './utils';

interface StreamWriterProps {
  writableStream: WritableStream;
}

export const StreamWriter: FC<StreamWriterProps> = ({ writableStream }) => {
  const data = useRef(0);
  const [rafId, setRafId] = useState<NodeJS.Timeout>();

  function appendAndScheduleNext() {
    const writer = writableStream.getWriter();
    writer.write(getCharacters(data.current));
    data.current = data.current + 1;
    writer.releaseLock();

    setRafId(
      setTimeout(() => {
        appendAndScheduleNext();
      }, 50),
    );
  }

  function handleStartTimer() {
    appendAndScheduleNext();
  }
  function handleStopTimer() {
    if (rafId) {
      clearTimeout(rafId);
      setRafId(undefined);
    }
  }

  return (
    <div className="flex flex-row gap justify-around">
      {!rafId ? (
        <button type="button" className="ghost-rect" onClick={handleStartTimer}>
          Start Streaming
        </button>
      ) : (
        <button type="button" className="ghost-rect" onClick={handleStopTimer}>
          Stop Streaming
        </button>
      )}
    </div>
  );
};

export const MemoStreamWriter = memo(StreamWriter);
