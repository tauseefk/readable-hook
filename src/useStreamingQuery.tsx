import { PrimitiveParam } from './constants';
import { useReadable } from './useReadable';
import { readableTextStream } from './utils/readableTextStream';

export const useStreamingQuery = (
  path: string,
  delay = 500,
): [
  { value: string; done: boolean; isStreaming: boolean },
  (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: (value?: string) => void;
  }) => Promise<void>,
] =>
  useReadable(
    () =>
      readableTextStream(path, {
        method: 'GET',
      }),
    delay,
  );
