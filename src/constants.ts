export type PrimitiveParam = string | boolean | number;

export interface UseReadableHookData {
  value: string;
  done: boolean;
  isStreaming: boolean
}

export const DEFAULT_STREAM_DATA: UseReadableHookData = {
  value: '',
  done: false,
  isStreaming: false
};