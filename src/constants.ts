export type PrimitiveParam = string | boolean | number;

export interface UseReadableHookData {
  value: string;
  isStreaming: boolean;
}

export const DEFAULT_STREAM_DATA: UseReadableHookData = {
  value: '',
  isStreaming: false,
};
