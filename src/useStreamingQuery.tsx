import { useCallback, useRef, useState } from 'react';
import { useThrottledCallback } from './utils/useThrottledCallback';
import { DEFAULT_STREAM_DATA, PrimitiveParam } from './constants';
import { useReadableHook } from './useReadableHook';
import { readableTextStream } from './utils/readableTextStream';

/**
 * Query a streaming endpoint
 * @param path streaming endpoint
 * @param delay time interval between each stream read call
 * @returns {[UseStreamingQueryData, () => void]}
 * returns a tuple of data retrieved from the stream, and a query function
 */
export const useStreamingQuery = (
  path: string,
  delay = 500,
): [
    { value: string; done: boolean; isStreaming: boolean },
    (onDone?: (value?: string) => void) => Promise<void>,
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

  const streamQuery = useCallback(
    async (onDone?: (value?: string) => void) => {
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      const response = await readableTextStream(path, {
        method: 'GET',
      });
      if (!response) throw new Error('No response from stream.');

      const reader = response.getReader();

      async function syncWithTextStream() {
        const { value, done } = await reader.read();
        if (!done) {
          frequentlyUpdatedData.current = { value, done, isStreaming: true };
          throttledUpdateState();

          requestAnimationFrame(async () => {
            await syncWithTextStream();
          });
          return;
        }

        frequentlyUpdatedData.current = {
          ...frequentlyUpdatedData.current,
          done: true,
          isStreaming: false,
        };
        throttledUpdateState();
        if (onDone) onDone(frequentlyUpdatedData.current.value);
      }

      await syncWithTextStream();
    },
    [path, throttledUpdateState],
  );

  return [{ value, done, isStreaming }, streamQuery];
};

export const useStreamingQueryV2 = (
  path: string,
  delay = 500,
): [
    { value: string; done: boolean; isStreaming: boolean },
    (options?: {
      params?: Record<string, PrimitiveParam>;
      onDone?: (value?: string) => void;
    }) => Promise<void>,
  ] =>
  useReadableHook(
    () =>
      readableTextStream(path, {
        method: 'GET',
      }),
    delay,
  );
