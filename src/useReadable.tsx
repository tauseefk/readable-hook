import { useCallback, useState } from 'react';
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
  delay = 500,
): [
  UseReadableHookData,
  (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
  }) => Promise<void>,
] => {
  const [{ value, isStreaming }, setData] =
    useState<UseReadableHookData>(DEFAULT_STREAM_DATA);

  const throttledUpdateState = useThrottledCallback(
    (data: UseReadableHookData) => {
      setData(data);
    },
    [],
    delay,
  );

  const synchronize = useCallback(
    async (options?: {
      params?: Record<string, PrimitiveParam>;
      onDone?: (value?: string) => void;
    }) => {
      const response = await streamProducer(options?.params);
      if (!response) throw new Error('No response from stream.');

      const reader = response.getReader();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        throttledUpdateState({ value, isStreaming: true });
      }
    },
    [streamProducer, throttledUpdateState],
  );

  return [{ value, isStreaming }, synchronize];
};
