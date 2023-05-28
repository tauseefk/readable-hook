/**
 * Query a streaming endpoint
 * @param path streaming endpoint
 * @param delay time interval between each stream read call
 * @returns {[UseStreamingQueryData, () => void]}
 * returns a tuple of data retrieved from the stream, and a query function
 */
export declare const useStreamingQuery: (path: string, delay?: number) => [{
    value: string;
    done: boolean;
    isStreaming: boolean;
}, (onDone?: ((value?: string) => void) | undefined) => Promise<void>];
export declare const useStreamingQueryV2: (path: string, delay?: number) => [{
    value: string;
    done: boolean;
    isStreaming: boolean;
}, (onDone?: ((value?: string) => void) | undefined) => Promise<void>];
