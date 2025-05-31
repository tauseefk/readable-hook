import { useRef, useState } from 'react';

import { AsyncIterableReader } from './AsyncIterable';
import { StreamReader } from './StreamReader';
import { StreamWriter } from './StreamWriter';

import './App.css';

const encoder = new TextEncoder();

export const App = () => {
  const [showAsyncIterableReader, setShowAsyncIterableReader] = useState(false);

  return (
    <div className="wrapper">
      <div className="flex container align-center justify-center m-auto-0 pointer">
        <label className="pointer">
          <input
            type="checkbox"
            onChange={() =>
              setShowAsyncIterableReader(!showAsyncIterableReader)
            }
            defaultChecked={showAsyncIterableReader}
          />
          <span className="px-2">Use Async Iterable</span>
        </label>
      </div>

      <div className="container grid align-center justify-center grid-gap-2">
        {showAsyncIterableReader ? (
          <AsyncIterableReader />
        ) : (
          <StreamReaderWriterExample />
        )}
      </div>
    </div>
  );
};

const StreamReaderWriterExample = () => {
  const transformStream = useRef(
    new TransformStream({
      async transform(chunk, controller) {
        controller.enqueue(encoder.encode(String(await chunk)));
      },
    }),
  );

  return (
    <>
      <StreamReader
        readableStream={transformStream.current.readable.pipeThrough(
          new TextDecoderStream(),
        )}
      />
      <StreamWriter writableStream={transformStream.current.writable} />
    </>
  );
};
