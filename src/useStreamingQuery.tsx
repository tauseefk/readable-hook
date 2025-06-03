import { AbortFn, SynchronizeFn } from './types';
import { useReadable } from './useReadable';
import { readableTextStream } from './utils/readableTextStream';

export const useStreamingQuery = (
  path: string,
  delay = 500,
): [{ value: string | null; isStreaming: boolean }, SynchronizeFn, AbortFn] =>
  useReadable(
    (_, signal) =>
      readableTextStream(path, {
        method: 'GET',
        signal,
      }),
    { delay },
  );
