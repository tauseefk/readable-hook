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
    const [streamingData, triggerQuery] = useStreamingQuery('path/to/api/endpoint');
    return (
        <div>
            {streamingData}
            <button onClick={fetchStreamingData} />
        </div>
    );
};
```
#### useReadableHook

Check [StreamReader](https://github.com/tauseefk/readable-hook/blob/main/examples/src/StreamReader.tsx) component inside examples.
