import { PrimitiveParam, UseReadableHookData } from './constants';
/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<String>} stream
 *  readable stream to synchronize with state
 * @param {number} delay
 *  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream,
 *  and a mutation trigger function
 */
export declare const useReadableHook: (streamProducer: (params?: Record<string, PrimitiveParam>) => Promise<ReadableStream<string>>, delay?: number) => [UseReadableHookData, (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
}) => Promise<void>];
