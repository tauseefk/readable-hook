import { useRef, useState, useCallback } from 'react';

import { PrimitiveParam, DEFAULT_STREAM_DATA } from './constants';
import { useThrottledCallback } from './utils/useThrottledCallback';
import { readableTextStream } from './utils/readableTextStream';
import { useReadable } from './useReadable';

/**
 * Trigger a mutation at a streaming endpoint
 * @param path streaming endpoint
 * @param staticParams params passed during hook initialization
 * @param delay time interval between each stream read call
 * @returns { [
 *  UseStreamingMutationData,
 *  (params?: Record<string, PrimitiveParam>) => void
 * ] }
 */
export const useStreamingMutation = (
  path: string,
  staticParams?: Record<string, PrimitiveParam>,
  delay = 500,
): [
  { value: string; done: boolean; isStreaming: boolean },
  (
    params?: Record<string, PrimitiveParam>,
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
    delay,
  );

  const streamMutation = useCallback(
    async (
      params?: Record<string, PrimitiveParam>,
      onDone?: (value?: string) => void,
    ) => {
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      const response = await readableTextStream(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...staticParams, ...params }),
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
    [path, staticParams, throttledUpdateState],
  );

  return [{ value, done, isStreaming }, streamMutation];
};

export const useStreamingMutationV2 = (
  path: string,
  staticParams?: Record<string, PrimitiveParam>,
  delay = 500,
): [
  { value: string; done: boolean; isStreaming: boolean },
  (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: (value?: string) => void;
  }) => Promise<void>,
] =>
  useReadable(
    (params?: Record<string, PrimitiveParam>) =>
      readableTextStream(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...staticParams,
          ...params,
        }),
      }),
    delay,
  );
