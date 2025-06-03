import { useCallback, useEffect, useRef, useState } from 'react';

import { AbortError } from './AbortError';
import { DEFAULT_STREAM_DATA, HookData, PrimitiveParam } from './constants';
import { AbortFn, SynchronizeFn } from './types';
import { useThrottledCallback } from './utils/useThrottledCallback';

/**
 * Synchronize React state with an Async Iterable.
 * @param {AsyncIterable<T>} asyncGenerator that returns the async iterable to synchronize with state
 * @param {number} delay  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
and a mutation trigger function
 */
// biome-ignore lint/complexity/noUselessTypeConstraint: typescript compiler won't have me
export const useIterable = <T extends unknown>(
  asyncGenerator: (
    params?: Record<string, PrimitiveParam>,
    signal?: AbortSignal,
  ) => Promise<AsyncIterable<T>>,
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
): [HookData<T>, SynchronizeFn, AbortFn] => {
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
      signal?: AbortSignal;
    }) => {
      // flush state
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      try {
        const response = await asyncGenerator(
          options?.params,
          options?.signal, // Pass signal
        );

        for await (const value of response) {
          // Check for abort before processing each value
          if (options?.signal?.aborted) {
            throw new AbortError('Abort signal received.');
          }

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
        if (
          (error instanceof DOMException && error.name === 'AbortError') ||
          error instanceof AbortError
        ) {
          frequentlyUpdatedData.current = {
            ...frequentlyUpdatedData.current,
            isStreaming: false,
          };
          throttledUpdateState();
          return;
        }
        throw error;
      }
    },
    [accumulate, accumulator, asyncGenerator, throttledUpdateState],
  );

  return [{ value, isStreaming }, synchronize, abort];
};
