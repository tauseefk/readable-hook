export const readableTextStream = async (
  path: string,
  options?: {
    method: 'GET' | 'POST';
    mode?: 'cors' | 'no-cors' | 'same-origin';
    body?: string;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  },
) => {
  const response = await fetch(path, options);
  if (!response.body) throw new Error('No response body found.');

  return response.body.pipeThrough(new TextDecoderStream());
};
