import { useCallback, useState } from 'react';

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

/**
 * Trigger a mutation at a streaming endpoint
 * @param path to the endpoint endpoint
 * @param staticParams parameters that can be passed at hook initialization
 * @returns {[string, (dynamicParams?: Record<string, string>) => void]} returns a tuple of data retrieved from the stream, and a mutation trigger function
 */
export const useStreamingMutation = (
  path: string,
  staticParams?: Record<string, string>,
): [string, (dynamicParams?: Record<string, string>) => void] => {
  const [data, setData] = useState('');

  const streamMutation = useCallback(
    async (dynamicParams?: Record<string, string>) => {
      const response = await readableTextStream(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...staticParams, ...dynamicParams }),
      });
      if (!response) return;

      const reader = response.getReader();
      async function syncWithTextStream() {
        const { value, done } = await reader.read();
        if (!done) {
          setData(value);

          requestAnimationFrame(async () => {
            await syncWithTextStream();
          });
        }
      }

      await syncWithTextStream();
    },
    [path, staticParams],
  );

  return [data, streamMutation];
};
