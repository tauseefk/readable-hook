import { useRef } from 'react';
import { StreamReader } from './StreamReader';
import { StreamWriter } from './StreamWriter';
import './App.css';

const encoder = new TextEncoder();

export const App = () => {
  const transformStream = useRef(
    new TransformStream({
      async transform(chunk, controller) {
        chunk = await chunk;
        controller.enqueue(encoder.encode(String(chunk)));
      },
    }),
  );

  return (
    <div className="flex flex-col container gap">
      <StreamWriter writableStream={transformStream.current.writable} />{' '}
      <StreamReader
        readableStream={transformStream.current.readable.pipeThrough(
          new TextDecoderStream(),
        )}
      />
    </div>
  );
};
