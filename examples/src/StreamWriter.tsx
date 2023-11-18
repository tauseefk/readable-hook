import { FC, memo, useRef, useState } from 'react';

const getCharacter = (idx: number) => {
  if (idx % 23 === 0) {
    return '\n';
  }
  if (idx % 2 === 0) {
    return '1';
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
        <button onClick={appendAndScheduleNext}>Start Streaming</button>
      ) : (
        <button onClick={handleStopTimer}>Stop Streaming</button>
      )}
    </div>
  );
};

export const MemoStreamWriter = memo(StreamWriter);
