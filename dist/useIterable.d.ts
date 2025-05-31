import { PrimitiveParam, UseReadableHookData } from './constants';
/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<T>} asyncGenerator readable stream to synchronize with state
 * @param {number} delay  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
and a mutation trigger function
 */
export declare const useIterable: <T extends unknown>(asyncGenerator: (params?: Record<string, PrimitiveParam>) => Promise<AsyncGenerator<T>>, { delay, accumulate, accumulator, }?: {
    delay?: number;
    accumulate?: boolean;
    accumulator?: (acc: T | null, curr: T) => T;
}) => [UseReadableHookData<T>, (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
}) => Promise<void>];
