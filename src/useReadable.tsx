import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_STREAM_DATA, HookData, PrimitiveParam } from './constants';
import { useThrottledCallback } from './utils/useThrottledCallback';

/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<T>} streamProducer
 *  readable stream to synchronize with state
 * @param {number} delay
 *  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
 *  and a mutation trigger function
 */

// biome-ignore lint/complexity/noUselessTypeConstraint: typescript compiler won't have me
export const useReadable = <T extends unknown>(
  streamProducer: (
    params?: Record<string, PrimitiveParam>,
    signal?: AbortSignal,
  ) => Promise<ReadableStream<T>>,
  {
    delay,
    accumulate,
    accumulator,
  }: {
    delay?: number;
    accumulate?: boolean;
    accumulator?: (acc: T | null, curr: T) => T;
  } = {
    delay: 500,
    accumulate: false,
  },
): [
  HookData<T>,
  (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
  }) => Promise<void>,
  () => void,
] => {
  const frequentlyUpdatedData = useRef<HookData<T>>(DEFAULT_STREAM_DATA);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [{ value, isStreaming }, setData] = useState(
    frequentlyUpdatedData.current,
  );

  const throttledUpdateState = useThrottledCallback(
    () => {
      setData({
        ...frequentlyUpdatedData.current,
      });
    },
    [],
    delay,
  );

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    return abort;
  }, [abort]);

  const synchronize = useCallback(
    async (options?: {
      params?: Record<string, PrimitiveParam>;
      onDone?: () => void;
    }) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // flush state
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      const response = await streamProducer(
        options?.params,
        abortControllerRef.current.signal,
      );
      if (!response) throw new Error('No response from stream.');

      const reader = response.getReader();

      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();

          if (done) break;

          frequentlyUpdatedData.current = {
            isStreaming: true,
            value:
              accumulate && accumulator
                ? accumulator(frequentlyUpdatedData.current.value, value)
                : value,
          };

          throttledUpdateState();
        }

        frequentlyUpdatedData.current = {
          ...frequentlyUpdatedData.current,
          isStreaming: false,
        };

        throttledUpdateState();
        options?.onDone?.();
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Stream was aborted, reset state
          frequentlyUpdatedData.current = {
            ...frequentlyUpdatedData.current,
            isStreaming: false,
          };
          throttledUpdateState();
          return;
        }
        throw error;
      } finally {
        reader.releaseLock();
      }
    },
    [accumulate, accumulator, streamProducer, throttledUpdateState],
  );

  return [{ value, isStreaming }, synchronize, abort];
};
