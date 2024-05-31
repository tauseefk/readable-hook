import { PrimitiveParam, UseReadableHookData } from "./constants";
/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<String>} streamProducer
 *  readable stream to synchronize with state
 * @param {number} delay
 *  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
 *  and a mutation trigger function
 */
export declare const useReadable: (streamProducer: (params?: Record<string, PrimitiveParam>) => Promise<ReadableStream<string>>, { delay, accumulate, accumulator, }?: {
    delay?: number | undefined;
    accumulate?: boolean | undefined;
    accumulator?: ((acc: string, curr: string) => string) | undefined;
}) => [UseReadableHookData, (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
}) => Promise<void>];
