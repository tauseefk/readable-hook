## Readable Hook

### Installation
```
npm i readable-hook --save
```

### Usage
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
