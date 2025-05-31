export type PrimitiveParam = string | boolean | number;

export interface UseReadableHookData<T> {
  value: T | null;
  isStreaming: boolean;
}

export const DEFAULT_STREAM_DATA = {
  value: null,
  isStreaming: false,
} satisfies UseReadableHookData<unknown>;
