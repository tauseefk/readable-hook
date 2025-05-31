import { useCallback, useState, useRef } from 'react';
import { useThrottledCallback } from './utils/useThrottledCallback';
import {
  DEFAULT_STREAM_DATA,
  PrimitiveParam,
  UseReadableHookData,
} from './constants';

/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<String>} streamProducer
 *  readable stream to synchronize with state
 * @param {number} delay
 *  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
 *  and a mutation trigger function
 */
export const useReadable = (
  streamProducer: (
    params?: Record<string, PrimitiveParam>,
  ) => Promise<ReadableStream<string>>,
  {
    delay,
    accumulate,
    accumulator,
  }: {
    delay?: number;
    accumulate?: boolean;
    accumulator?: (acc: string, curr: string) => string;
  } = {
    delay: 500,
    accumulate: false,
    accumulator: (acc: string, curr: string) => `${acc}${curr}`,
  },
): [
  UseReadableHookData,
  (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
  }) => Promise<void>,
] => {
  const frequentlyUpdatedData = useRef(DEFAULT_STREAM_DATA);
  const [{ value, isStreaming }, setData] = useState<UseReadableHookData>(
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

  const synchronize = useCallback(
    async (options?: {
      params?: Record<string, PrimitiveParam>;
      onDone?: () => void;
    }) => {
      // flush state
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      const response = await streamProducer(options?.params);
      if (!response) throw new Error('No response from stream.');

      const reader = response.getReader();

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
    },
    [accumulate, accumulator, streamProducer, throttledUpdateState],
  );

  return [{ value, isStreaming }, synchronize];
};
