import { useCallback, useState } from 'react';

const readableTextStream = async (
  path: string,
  options?: {
    method?: 'GET' | 'POST';
    payload?: any;
    headers?: Record<string, string>;
  },
) => {
  const response = await fetch(path, options);
  if (!response.body) throw new Error('No response body found.');

  return response.body.pipeThrough(new TextDecoderStream());
};

/**
 * Fetch data from a streaming endpoint
 * @param path endpoint to fetch the response from
 * @returns {[string, () => void]} returns a tuple of data retrieved from the stream, and a query trigger function
 */
export const useStreamingQuery = (path: string): [string, () => void] => {
  const [data, setData] = useState('');

  const queryStream = useCallback(async () => {
    const response = await readableTextStream(path);
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

    syncWithTextStream();
  }, [path]);

  return [data, queryStream];
};