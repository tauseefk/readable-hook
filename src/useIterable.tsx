import { useCallback, useState, useRef } from "react";
import { useThrottledCallback } from "./utils/useThrottledCallback";
import {
  DEFAULT_STREAM_DATA,
  PrimitiveParam,
  UseReadableHookData,
} from "./constants";

/**
 * Synchronize React state with a ReadableStream.
 * @param {ReadableStream<T>} asyncGenerator readable stream to synchronize with state
 * @param {number} delay  time interval between each stream read call
 * @returns a tuple of data retrieved from the stream
and a mutation trigger function
 */
// biome-ignore lint/complexity/noUselessTypeConstraint: typescript compiler won't have me
export const useIterable = <T extends unknown>(
  asyncGenerator: (
    params?: Record<string, PrimitiveParam>,
  ) => Promise<AsyncGenerator<T>>,
  {
    delay,
    accumulate,
    accumulator,
  }: {
    delay?: number;
    accumulate?: boolean;
    accumulator?: (acc: T | null, curr: T) => T;
  } = {
    delay: 500,
    accumulate: false,
  },
): [
  UseReadableHookData<T>,
  (options?: {
    params?: Record<string, PrimitiveParam>;
    onDone?: () => void;
  }) => Promise<void>,
] => {
  const frequentlyUpdatedData =
    useRef<UseReadableHookData<T>>(DEFAULT_STREAM_DATA);
  const [{ value, isStreaming }, setData] = useState(
    frequentlyUpdatedData.current,
  );

  const throttledUpdateState = useThrottledCallback(
    () => {
      setData({
        ...frequentlyUpdatedData.current,
      });
    },
    [],
    delay,
  );

  const synchronize = useCallback(
    async (options?: {
      params?: Record<string, PrimitiveParam>;
      onDone?: () => void;
    }) => {
      // flush state
      frequentlyUpdatedData.current = DEFAULT_STREAM_DATA;

      const response = await asyncGenerator(options?.params);
      for await (const value of response) {
        frequentlyUpdatedData.current = {
          isStreaming: true,
          value:
            accumulate && accumulator
              ? accumulator(frequentlyUpdatedData.current.value, value)
              : value,
        };
        throttledUpdateState();
      }

      frequentlyUpdatedData.current = {
        ...frequentlyUpdatedData.current,
        isStreaming: false,
      };

      throttledUpdateState();
      options?.onDone?.();
    },
    [accumulate, accumulator, asyncGenerator, throttledUpdateState],
  );

  return [{ value, isStreaming }, synchronize];
};
