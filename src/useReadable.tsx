import { useCallback, useRef, useState } from 'react';
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
 * @returns a tuple of data retrieved from the stream,
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
  const frequentlyUpdatedData = useRef(DEFAULT_STREAM_DATA);
  const [{ value, done, isStreaming }, setThrottledData] = useState(
    frequentlyUpdatedData.current,
  );

  const throttledUpdateState = useThrottledCallback(
    () => {
      setThrottledData({ ...frequentlyUpdatedData.current });
    },
    [],
    delay,
  );

  const synchronize = useCallback(
    async (options?: {
      params?: Record<string, PrimitiveParam>;
      onDone?: (value?: string) => void;
    }) => {
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      const response = await streamProducer(options?.params);
      if (!response) throw new Error('No response from stream.');

      const reader = response.getReader();

      async function syncWithStream() {
        const { value, done } = await reader.read();
        if (!done) {
          frequentlyUpdatedData.current = { value, done, isStreaming: true };
          throttledUpdateState();

          requestAnimationFrame(async () => {
            await syncWithStream();
          });
          return;
        }

        frequentlyUpdatedData.current = {
          ...frequentlyUpdatedData.current,
          done: true,
          isStreaming: false,
        };
        throttledUpdateState();
        if (options?.onDone)
          options.onDone(frequentlyUpdatedData.current.value);
      }

      await syncWithStream();
    },
    [streamProducer, throttledUpdateState],
  );

  return [{ value, done, isStreaming }, synchronize];
};
