import { HookData, PrimitiveParam } from './constants';
import { AbortFn, SynchronizeFn } from './types';
/**
 * Synchronize React state with an Async Iterable.
 * @param {AsyncIterable<T>} asyncGenerator that returns the async iterable to synchronize with state
 * @param {number} delay  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
and a mutation trigger function
 */
export declare const useIterable: <T extends unknown>(asyncGenerator: (params?: Record<string, PrimitiveParam>, signal?: AbortSignal) => Promise<AsyncIterable<T>>, { delay, accumulate, accumulator, }?: {
    delay?: number;
    accumulate?: boolean;
    accumulator?: (acc: T | null, curr: T) => T;
}) => [HookData<T>, SynchronizeFn, AbortFn];
