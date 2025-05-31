import { useRef } from 'react';
import { StreamReader } from './StreamReader';
import { StreamWriter } from './StreamWriter';
import './App.css';
import { AsyncIterableReader } from './AsyncIterable';

const encoder = new TextEncoder();

export const App = () => {
  const transformStream = useRef(
    new TransformStream({
      async transform(chunk, controller) {
        controller.enqueue(encoder.encode(String(await chunk)));
      },
    }),
  );

  return (
    <div className="wrapper">
      <div className="container grid align-center justify-center grid-gap-2">
        <AsyncIterableReader />
        <StreamReader
          readableStream={transformStream.current.readable.pipeThrough(
            new TextDecoderStream(),
          )}
        />
        <StreamWriter writableStream={transformStream.current.writable} />
      </div>
    </div>
  );
};
