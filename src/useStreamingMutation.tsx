import { PrimitiveParam } from './constants';
import { useReadable } from './useReadable';
import { readableTextStream } from './utils/readableTextStream';

export const useStreamingMutation = (
  path: string,
  staticParams?: Record<string, PrimitiveParam>,
  options?: {
    accumulate?: boolean;
    delay?: number;
  },
): [
  { value: string | null; isStreaming: boolean },
  (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: (value?: string) => void;
  }) => Promise<void>,
  () => void,
] =>
  useReadable(
    (params?: Record<string, PrimitiveParam>, signal?: AbortSignal) =>
      readableTextStream(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...staticParams,
          ...params,
        }),
        signal,
      }),
    options,
  );
