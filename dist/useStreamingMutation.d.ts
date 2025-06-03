import { PrimitiveParam } from './constants';
import { AbortFn, SynchronizeFn } from './types';
export declare const useStreamingMutation: (path: string, staticParams?: Record<string, PrimitiveParam>, options?: {
    accumulate?: boolean;
    delay?: number;
}) => [{
    value: string | null;
    isStreaming: boolean;
}, SynchronizeFn, AbortFn];
