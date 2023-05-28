import { useCallback, useRef, useState } from 'react';
import { useThrottledCallback } from './utils/useThrottledCallback';
import { DEFAULT_STREAM_DATA, UseReadableHookData } from './constants';

/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<String>} stream readable stream to synchronize with state
 * @param {number} delay time interval between each stream read call
 * @returns {[UseReadableHookData, () => void]} returns a tuple of data retrieved from the stream, and a mutation trigger function
 */
export const useReadableHook = (
  stream: Promise<ReadableStream<string>>,
  delay = 500,
): [
    UseReadableHookData,
    (
      onDone?: (value?: string) => void,
    ) => Promise<void>,
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
    delay
  );

  const synchronize = useCallback(
    async (
      onDone?: (value?: string) => void,
    ) => {
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      const response = await stream;
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
        if (onDone) onDone(frequentlyUpdatedData.current.value);
      }

      await syncWithStream();
    },
    [stream, throttledUpdateState],
  );

  return [{ value, done, isStreaming }, synchronize];
};
