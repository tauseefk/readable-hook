import { HookData, PrimitiveParam } from './constants';
/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<T>} streamProducer
 *  readable stream to synchronize with state
 * @param {number} delay
 *  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
 *  and a mutation trigger function
 */
export declare const useReadable: <T extends unknown>(streamProducer: (params?: Record<string, PrimitiveParam>) => Promise<ReadableStream<T>>, { delay, accumulate, accumulator, }?: {
    delay?: number;
    accumulate?: boolean;
    accumulator?: (acc: T | null, curr: T) => T;
}) => [HookData<T>, (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
}) => Promise<void>];
