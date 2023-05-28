import { UseReadableHookData } from './constants';
/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<String>} stream
 *  readable stream to synchronize with state
 * @param {number} delay
 *  time interval between each stream read call
 * @returns {[UseReadableHookData, () => void]}
 *  returns a tuple of data retrieved from the stream,
 *  and a mutation trigger function
 */
export declare const useReadableHook: (stream: Promise<ReadableStream<string>>, delay?: number) => [UseReadableHookData, (onDone?: ((value?: string) => void) | undefined) => Promise<void>];
