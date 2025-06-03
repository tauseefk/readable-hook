## Readable Hook

React hooks for wrangling `ReadableStream`s.

### Installation

```
npm i readable-hook --save
```

### Usage

#### useStreamingQuery

```Typescript
const MyComponent: FC = () => {
  const [{ value }, triggerQuery] = useStreamingQuery("path/to/api/endpoint");
  return (
    <div>
      {value}
      <button onClick={fetchStreamingData} />
    </div>
  );
};
```

#### useStreamingMutation

Allows synchronizing state with a mutation endpoint that returns a streaming response.
Has a few different ways to pass parameters (at init, and at mutation trigger).

```Typescript
const MyComponent: FC = () => {
  const [{ value, isStreaming, done }, triggerMutation] = useStreamingMutation(
    "path/to/api/endpoint",
    {
      // params that can be passed during initialization
    },
  );
  return (
    <div>
      {value}
      <input
        onSubmit={e =>
          triggerMutation({
            params: {
              inputValue: e.target.value,
            },
            onDone: () => console.log("Done streaming"),
          })}
      />
    </div>
  );
};
```

### useReadable

Allows synchronizing state with a `ReadableStream`.
Check [this](https://github.com/tauseefk/readable-hook/blob/main/examples/src/StreamReader.tsx) for a full example.

```Typescript
const MyComponent: FC<{ readableStream: ReadableStream }> = (
  { readableStream },
) => {
  const [{ value }, synchronize] = useReadable(async () => readableStream, 100);
  return (
    <div>
      {value}
      <button onClick={synchronize} />
    </div>
  );
};
```

### useIterable

Allows synchronizing state with an async Iterable.
Check [this](https://github.com/tauseefk/readable-hook/blob/main/examples/src/AsyncIterable.tsx) for a full example.

```Typescript
async function* getIntegers() {
  let idx = 0;

  while (true) {
    if (signal?.aborted) {
      break;
    }
    await delay(100);
    idx += 1;
    yield getCharacters(idx).toString();
  }
}

const MyComponent = () => {
  const [{ value }, synchronize] = useIterable<string>(
    async (_, signal) => getIntegers(signal),
    {
      accumulate: true,
      accumulator: (acc, curr) =>
        acc
          ? `${acc}${curr}`
          : `${curr} `,
      delay: 100,
    },
  );

  return (
    <div>
      {value}
      <button onClick={synchronize} />
    </div>
  );
};
```
