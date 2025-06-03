import { AbortFn, SynchronizeFn } from './types';
export declare const useStreamingQuery: (path: string, delay?: number) => [{
    value: string | null;
    isStreaming: boolean;
}, SynchronizeFn, AbortFn];
