import { PrimitiveParam } from './constants';
import { readableTextStream } from './utils/readableTextStream';
import { useReadable } from './useReadable';

export const useStreamingMutation = (
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
