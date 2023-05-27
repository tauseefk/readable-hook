import { useCallback, useRef, useState } from 'react';
import { useThrottledCallback } from './utils/useThrottledCallback';

const readableTextStream = async (
  path: string,
  options?: {
    method: 'GET' | 'POST';
    body?: any;
    headers?: Record<string, string>;
  },
) => {
  const response = await fetch(path, options);
  if (!response.body) throw new Error('No response body found.');

  return response.body.pipeThrough(new TextDecoderStream());
};

/**
 * Fetch state from a streaming endpoint
 * @param path endpoint to fetch the response from
 * @returns {[string, () => void]} returns a tuple of data retrieved from the stream, and a query trigger function
 */
export const useStreamingQuery = (path: string): [string, () => void] => {
  const [data, setData] = useState('');

  const streamQuery = useCallback(async () => {
    let animationFrameId: number | null = null;
    const response = await readableTextStream(path);
    if (!response) return;

    const reader = response.getReader();
    async function syncWithTextStream() {
      const { value, done } = await reader.read();
      if (!done) {
        setData(value);

        animationFrameId = requestAnimationFrame(async () => {
          await syncWithTextStream();
        });
        return;
      }

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    syncWithTextStream();
  }, [path]);

  return [data, streamQuery];
};

const DEFAULT_STREAM_DATA: UseStreamingMutationData = { value: '', done: false, isStreaming: false };
interface UseStreamingMutationData { value: string, done: boolean, isStreaming: boolean }
type PrimitiveParam = string | boolean | number;

/**
 * Trigger a mutation at a streaming endpoint
 * @param path streaming endpoint
 * @param staticParams params passed during hook initialization
 * @param delay time interval between each stream read call
 * @returns {[UseStreamingMutationData, (dynamicParams?: Record<string, PrimitiveParam>) => void]} returns a tuple of data retrieved from the stream, and a mutation trigger function
 */
export const useStreamingMutation = (
  path: string,
  staticParams: Record<string, PrimitiveParam>,
  delay = 500,
): [
    { value: string; done: boolean; isStreaming: boolean },
    (
      dynamicParams?: Record<string, PrimitiveParam>,
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

  const streamMutation = useCallback(
    async (
      dynamicParams?: Record<string, PrimitiveParam>,
      onDone?: (value?: string) => void,
    ) => {
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      const response = await readableTextStream(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...staticParams, ...dynamicParams }),
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
